import React from 'react'
import ContentTop from '../../components/ContentTop/ContentTop'
import { customAxios } from '../../utils/axios'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

const NewsBlock: React.FC<{
	id: string
	description: string
	img_link: string
	onFetchData: any
}> = ({ description, img_link, id, onFetchData }) => {
	const { isAdmin } = useSelector((state: RootState) => state.authSlice)

	const onDeleteNews = () => {
		if (window.confirm('Вы действительно хотите удалить пост?')) {
			try {
				customAxios(`/news?id=${id}&prevname=${img_link}`, 'delete').then((data) => {
					alert('Пост был успешно удален')
					onFetchData()
				})
			} catch (error) {
				console.log(error)
			}
		}
	}

	return (
		<div className='news__block'>
			{isAdmin && (
				<button className='button' onClick={onDeleteNews}>
					удалить пост
				</button>
			)}
			<div className='news__img'>
				<img src={`${process.env.REACT_APP_SERVER_URL}/uploads/news/${img_link}`} alt='' />
			</div>
			<div className='news__desc'>{description}</div>
		</div>
	)
}

export default NewsBlock

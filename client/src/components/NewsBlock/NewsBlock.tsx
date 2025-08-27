import React from 'react'
import ContentTop from '../../components/ContentTop/ContentTop'
import { customAxios } from '../../utils/axios'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { translateOneDate } from '../../utils/translateOneDate'

const NewsBlock: React.FC<{
	id: string
	description: string
	img_link: string
	onFetchData: any
	data: any
	fetchLikes: any
}> = ({ description, img_link, id, onFetchData, data, fetchLikes }) => {
	const { isAdmin, dataUser } = useSelector((state: RootState) => state.authSlice)
	const [count, setCount] = React.useState(0)
	const [isLike, setIsLike] = React.useState(false)

	React.useEffect(() => {
		const userLiked = fetchLikes.map(
			(itemLikes: any) => itemLikes.id === id && itemLikes.user_id == dataUser.id,
		).length
		console.log(fetchLikes)
		setIsLike(userLiked)
		setCount(fetchLikes.map((itemLikes: any) => itemLikes.id === id).length)
	}, [])

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

	const onClickLike = () => {
		try {
			!isLike
				? customAxios(`/newslike?id=${id}`, 'post').then((data) => {
						setCount(count + 1)
						setIsLike(true)
				  })
				: customAxios(`/newslike?id=${id}`, 'delete').then((data) => {
						setCount(count - 1)
						setIsLike(false)
				  })
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className='news__block'>
			{isAdmin && (
				<button className='button' onClick={onDeleteNews}>
					удалить пост
				</button>
			)}
			<h5 className='news__data'>{translateOneDate(data)}</h5>
			<div className='news__img'>
				<img src={`${process.env.REACT_APP_SERVER_URL}/uploads/news/${img_link}`} alt='' />
			</div>
			<div className='news__likes' onClick={() => onClickLike()}>
				<svg
					viewBox='0 0 12 12'
					enable-background='new 0 0 12 12'
					id='Слой_1'
					version='1.1'
					xmlSpace='preserve'
					xmlns='http://www.w3.org/2000/svg'
					xmlnsXlink='http://www.w3.org/1999/xlink'
					width='25'
				>
					<g id='SVGRepo_bgCarrier' stroke-width='0'></g>
					<g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g>
					<g id='SVGRepo_iconCarrier'>
						<path
							d='M8.5,1C7.5206299,1,6.6352539,1.4022217,6,2.0504761C5.3648071,1.4022827,4.4793701,1,3.5,1 C1.5670166,1,0,2.5670166,0,4.5S2,8,6,11c4-3,6-4.5670166,6-6.5S10.4329834,1,8.5,1z'
							fill={isLike ? '#f54242' : '#fff'}
						></path>
					</g>
				</svg>
				<h4 className='news__likes-count'>{count}</h4>
			</div>
			<div className='news__desc'>{description}</div>
		</div>
	)
}

export default NewsBlock

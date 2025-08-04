import React from 'react'
import ContentTop from '../../components/ContentTop/ContentTop'
import { customAxios } from '../../utils/axios'
import NewsBlock from '../../components/NewsBlock/NewsBlock'

const News: React.FC = () => {
	const [fetchData, setFetchData] = React.useState<any>([])

	React.useEffect(() => {
		customAxios(`/news`, 'get').then((data) => {
			setFetchData(data)
		})
	}, [])

	return (
		<div className='news'>
			<ContentTop title='Новости' setFetchData={setFetchData} />
			{fetchData.length ? (
				fetchData.map((item: any) => <NewsBlock key={item.id} {...item} />)
			) : (
				<h1>Пока нет новостей</h1>
			)}
		</div>
	)
}

export default News

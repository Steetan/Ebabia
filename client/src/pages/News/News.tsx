import React from 'react'
import ContentTop from '../../components/ContentTop/ContentTop'
import { customAxios } from '../../utils/axios'
import NewsBlock from '../../components/NewsBlock/NewsBlock'

const News: React.FC = () => {
	const [fetchData, setFetchData] = React.useState<any>([])

	const onFetchData = () => {
		customAxios(`/news`, 'get').then((data) => {
			setFetchData(data)
		})
	}

	React.useEffect(() => {
		onFetchData()
	}, [])

	return (
		<div className='news'>
			<ContentTop title='Новости' setFetchData={setFetchData} />
			{fetchData?.length ? (
				fetchData.map((item: any) => (
					<NewsBlock key={item.id} {...item} onFetchData={onFetchData} />
				))
			) : (
				<h1>Пока нет новостей</h1>
			)}
		</div>
	)
}

export default News

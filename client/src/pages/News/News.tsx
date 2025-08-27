import React from 'react'
import ContentTop from '../../components/ContentTop/ContentTop'
import { customAxios } from '../../utils/axios'
import NewsBlock from '../../components/NewsBlock/NewsBlock'

const News: React.FC = () => {
	const [fetchData, setFetchData] = React.useState<any>([])
	const [fetchLikes, setFetchLikes] = React.useState<any>([])
	const [loading, setLoading] = React.useState(true)
	const [error, setError] = React.useState<string | null>(null)

	const onFetchData = async () => {
		try {
			const data = await customAxios('/news', 'get')
			setFetchData(data)
		} catch (err) {
			setError('Ошибка при загрузке новостей')
		}
	}

	const onFetchLikes = async () => {
		try {
			const data = await customAxios('/newslikes', 'get')
			setFetchLikes(data)
		} catch (err) {
			setError('Ошибка при загрузке лайков')
		}
	}

	React.useEffect(() => {
		const fetchDataAndLikes = async () => {
			await Promise.all([onFetchData(), onFetchLikes()])
			setLoading(false)
		}
		fetchDataAndLikes()
	}, [])

	if (loading) {
		return <h1>Загрузка...</h1>
	}

	if (error) {
		return <h1>{error}</h1>
	}

	return (
		<div className='news'>
			<ContentTop title='Новости' setFetchData={setFetchData} />
			{fetchData.length ? (
				fetchData.map((item: any) => (
					<NewsBlock key={item.id} {...item} onFetchData={onFetchData} fetchLikes={fetchLikes} />
				))
			) : (
				<h1>Пока нет новостей</h1>
			)}
		</div>
	)
}

export default News

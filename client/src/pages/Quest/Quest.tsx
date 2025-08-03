import React from 'react'
import { IVideo } from '../News/News'
import VideoPrev from '../../components/VideoPrev/VideoPrev'
import { customAxios } from '../../utils/axios'
import { useSearchParams } from 'react-router-dom'

const Quest: React.FC = ({}) => {
	const [fetchDataSearch, setFetchDataSearch] = React.useState([])
	const [searchParams, setSearchParams] = useSearchParams()
	const searchTerm = searchParams.get('search')
	React.useEffect(() => {
		const fetchData = async () => {
			await customAxios(`/quest?search=${searchTerm}`, 'get').then((fetData) => {
				setFetchDataSearch(fetData)
			})
		}
		fetchData()
	}, [])

	return (
		<div>
			{fetchDataSearch.length ? (
				fetchDataSearch.map((item: IVideo) => <VideoPrev key={item.id} {...item} />)
			) : (
				<h1>Ничего не найдено</h1>
			)}
		</div>
	)
}

export default Quest

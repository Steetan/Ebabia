import React, { useEffect, useState } from 'react'
import { useVideos } from '../../utils/fetchData'
import VideoPrev from '../../components/VideoPrev/VideoPrev'
import Search from '../../components/Search/Search'

export interface IVideo {
	id: string
	link: string
	description?: string
	category: string
	title: string
	preview: string
}

const Home: React.FC = () => {
	const { data, isLoading, error } = useVideos('')
	const [fetchData, setFetchData] = useState<IVideo[]>([])

	useEffect(() => {
		if (Array.isArray(data)) {
			setFetchData(data)
		} else {
			setFetchData([])
		}
	}, [data])

	if (isLoading) {
		return <div>Loading...</div>
	}

	if (error) {
		return <div>Error loading videos: {error.message}</div>
	}

	return (
		<div className='video'>
			<div className='video-block__top'>
				<h1>Все видео</h1>
				<Search />
			</div>
			<div className='video-block'>
				{fetchData.map((item: IVideo) => (
					<VideoPrev key={item.id} {...item} />
				))}
			</div>
		</div>
	)
}

export default Home

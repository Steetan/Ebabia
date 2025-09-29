import React, { useEffect, useState } from 'react'
import { useVideos } from '../../utils/fetchData'
import VideoPrev from '../../components/VideoPrev/VideoPrev'
import ContentTop from '../../components/ContentTop/ContentTop'

export interface IVideo {
	id: string
	link: string
	description?: string
	title: string
	preview: string
}

const Video: React.FC = () => {
	const { data, isLoading, error } = useVideos('/prevvideo')
	const [fetchData, setFetchData] = useState<IVideo[]>([])

	const fetchVideos = () => {
		if (Array.isArray(data)) {
			setFetchData(data)
		} else {
			setFetchData([])
		}
	}

	useEffect(() => {
		fetchVideos()
	}, [data])

	if (isLoading) {
		return <div>Loading...</div>
	}

	if (error) {
		return <div>Error loading videos: {error.message}</div>
	}

	return (
		<div className='video'>
			<ContentTop title='Все видео' setFetchData={setFetchData} />
			<div className='video-block'>
				{fetchData.length ? (
					fetchData.map((item: IVideo) => (
						<VideoPrev key={item.id} {...item} setFetchData={setFetchData} fetchData={fetchData} />
					))
				) : (
					null
				)}
				</div>
				{!fetchData.length && <h1 className='loading-status'>Пока нет видео🥱</h1>}
		</div>
	)
}

export default Video

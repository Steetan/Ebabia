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
			<ContentTop title='Все видео' setFetchData={setFetchData} />
			<div className='video-block'>
				{fetchData.map((item: IVideo) => (
					<VideoPrev key={item.id} {...item} />
				))}
			</div>
		</div>
	)
}

export default Video

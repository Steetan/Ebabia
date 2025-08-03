import React from 'react'
import { useVideos } from '../../utils/fetchData'
import VideoPrev from '../../components/VideoPrev/VideoPrev'
import { IVideo } from '../../pages/Home'
import { customAxios } from '../../utils/axios'

const RecommendsBlock: React.FC = () => {
	const [fetchArrVideo, setFetchArrVideo] = React.useState<IVideo[]>([])

	React.useEffect(() => {
		const fetchData = async () => {
			await customAxios('', 'get').then((fetData) => {
				setFetchArrVideo(fetData)
			})
		}
		fetchData()
	}, [])

	return (
		<div>
			{fetchArrVideo.map((item: IVideo) => (
				<VideoPrev key={item.id} {...item} />
			))}
		</div>
	)
}

export default RecommendsBlock

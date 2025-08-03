import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { IVideo } from '../News/News'
import { useVideos } from '../../utils/fetchData'
import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { customAxios } from '../../utils/axios'

const FullVideo: React.FC = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const searchTerm = searchParams.get('look')
	const [fetchCurrentVideo, setFetchCurrentVideo] = React.useState<any>(null)

	const { userImgUrl } = useSelector((state: RootState) => state.authSlice)

	React.useEffect(() => {
		const fetchData = async () => {
			customAxios(`/video?look=${searchTerm}`, 'get').then((fetData) => {
				setFetchCurrentVideo(fetData)
			})
		}
		fetchData()
	}, [])

	return (
		<div className='fullvideo'>
			<h3 className='video-block__title'>{fetchCurrentVideo?.title}</h3>
			<div className='fullvideo__block'>
				<video
					className='fullvideo__video'
					src={`${process.env.REACT_APP_SERVER_URL}/uploads/videos/${fetchCurrentVideo?.link}`}
					controls
				></video>

				<p className='video-block__title'>{fetchCurrentVideo?.description}</p>
			</div>
		</div>
	)
}

export default FullVideo

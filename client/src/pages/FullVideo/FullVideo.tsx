import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { customAxios } from '../../utils/axios'
import Comments from '../../components/Comments/Comments'
import { translateOneDateWithoutTime } from '../../utils/translateOneDateWithoutTime'

const FullVideo: React.FC = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const searchTerm = searchParams.get('look')
	const [fetchCurrentVideo, setFetchCurrentVideo] = React.useState<any>(null)

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
			<div className='fullvideo__block'>
				<video
					className='fullvideo__video'
					src={`${process.env.REACT_APP_SERVER_URL}/uploads/videos/${fetchCurrentVideo?.link}`}
					controls
				></video>
				<div className='fullvideo__block-right'>
					<div className='fullvideo__top'>
						<h3 className='fullvideo__title'>{fetchCurrentVideo?.title}</h3>
						<h4 className='fullvideo__data'>
							{translateOneDateWithoutTime(fetchCurrentVideo?.data)}
						</h4>
					</div>
					<p className='fullvideo__desc'>{fetchCurrentVideo?.description}</p>
				</div>
			</div>
			<Comments />
		</div>
	)
}

export default FullVideo

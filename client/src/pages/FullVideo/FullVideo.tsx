import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { customAxios } from '../../utils/axios'
import { TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import Comment from '../../components/Comment/Comment'
import Comments from '../../components/Comments/Comments'

const FullVideo: React.FC = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const searchTerm = searchParams.get('look')
	const [fetchCurrentVideo, setFetchCurrentVideo] = React.useState<any>(null)
	const [isChecked, setIsChecked] = React.useState(false)

	const { register, handleSubmit, setValue } = useForm<any>()

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
				<div>
					<h3 className='fullvideo__title'>{fetchCurrentVideo?.title}</h3>
					<p className='fullvideo__desc'>{fetchCurrentVideo?.description}</p>
				</div>
			</div>
			<Comments />
		</div>
	)
}

export default FullVideo

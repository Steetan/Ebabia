import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { customAxios } from '../../utils/axios'
import { TextField } from '@mui/material'
import { useForm } from 'react-hook-form'

const FullVideo: React.FC = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const searchTerm = searchParams.get('look')
	const [fetchCurrentVideo, setFetchCurrentVideo] = React.useState<any>(null)
	const [isChecked, setIsChecked] = React.useState(false)

	const { isAuth } = useSelector((state: RootState) => state.authSlice)

	const { register, handleSubmit, setValue } = useForm<any>()

	React.useEffect(() => {
		const fetchData = async () => {
			customAxios(`/video?look=${searchTerm}`, 'get').then((fetData) => {
				setFetchCurrentVideo(fetData)
			})
		}
		fetchData()
	}, [])

	const onSubmit = async (values: any) => {}

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
			<div className='fullvideo__comments'>
				<h1 className='fullvideo__comments-title'>Комментарии</h1>
				{isAuth && (
					<div className='reviews__create-block'>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className='form-block__inputs'>
								<TextField
									placeholder='Описание '
									multiline
									rows={2}
									maxRows={8}
									{...register('description')}
								/>
								<div className='form-block__btns'>
									<button type='submit' className='button button--footer button--reviews'>
										Добавить комментарий
									</button>
								</div>
							</div>
						</form>
					</div>
				)}
				<div className='fullvideo__comment'>
					<div className='fullvideo__comment-top'>
						<img src={require('../../assets/logo.png')} alt='' className='fullvideo__comment-img' />
						<h4>Вася Пупкин</h4>
					</div>
					<p className='fullvideo__comment-desc'>
						Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error nesciunt ab cumque
						fugiat hic voluptatibus mollitia illo asperiores rerum et!
					</p>
				</div>
			</div>
		</div>
	)
}

export default FullVideo

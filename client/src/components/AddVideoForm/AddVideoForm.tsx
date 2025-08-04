import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { TextField } from '@mui/material'
import { customAxios } from '../../utils/axios'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import Cookies from 'js-cookie'
import { customAxiosFile } from '../../utils/axiosFile'

export interface FormData {
	title: string
	description: string
}

const AddVideoForm: React.FC = () => {
	const { isAuth } = useSelector((state: RootState) => state.authSlice)
	const [videoUrl, setVideoUrl] = React.useState<string | null>(null)
	const [videoFile, setVideoFile] = React.useState<File | null>(null)
	const [imgUrl, setImgUrl] = React.useState<any>(null)
	const navigate = useNavigate()

	const inputFileRef = React.useRef<HTMLInputElement>(null)
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>()

	const onSubmit: SubmitHandler<FormData> = async (data) => {
		if (videoFile) {
			const formData = new FormData()
			formData.append('title', data.title)
			formData.append('description', data.description)
			formData.append('video', videoFile)
			formData.append('imageUrl', imgUrl)

			try {
				await customAxios(`/addvideo`, 'post', {
					title: data.title,
					description: data.description,
					video: videoFile,
					imageUrl: imgUrl,
				}).then(() => {
					navigate('/')
				})
			} catch (error) {
				console.error('Ошибка при регистрации', error)
			}
		} else {
			alert('Пожалуйста, загрузите видео')
		}
	}

	const removeVideo = () => {
		setVideoUrl(null)
		setVideoFile(null)
	}

	const handleFileChange = async (event: any) => {
		try {
			const formData = new FormData()
			formData.append('image', event.target.files[0])

			customAxiosFile(`/prev`, 'post', formData).then((data) => {
				setImgUrl(data?.url)
			})
		} catch (error) {
			console.warn(error)
		}
	}

	const deleteImg = () => {
		try {
			customAxiosFile(`/prev/${imgUrl}`, 'delete')
			if (inputFileRef.current) {
				inputFileRef.current.value = ''
			}
			setImgUrl('')
		} catch (error) {
			console.log(error)
		}
	}

	!isAuth && navigate('/')

	return (
		<div className='form-block-wrapper'>
			<div className='form-block'>
				<h3 className='form-block__title'>Добавить видео</h3>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className='form-block__inputs'>
						<TextField
							error={!!errors.title}
							id='outlined-basic'
							label='Название'
							variant='outlined'
							{...register('title', { required: 'Укажите название' })}
						/>
						{errors.title && <p style={{ color: 'red' }}>{errors.title.message}</p>}
						<TextField
							id='outlined-basic'
							label='Описание'
							type='text'
							variant='outlined'
							{...register('description')}
						/>
						{!videoUrl ? (
							<label htmlFor='file-upload' className='custom-file-upload'>
								Загрузить видео
							</label>
						) : (
							<label onClick={removeVideo} className='custom-file-upload'>
								Выбрать другое видео
							</label>
						)}
						{!imgUrl && (
							<label htmlFor='file-upload-image' className='custom-file-upload'>
								Загрузить фото
							</label>
						)}
						<input
							id='file-upload-image'
							ref={inputFileRef}
							type='file'
							accept='image/*'
							style={{ display: 'none' }}
							onChange={handleFileChange}
						/>
						<input
							id='file-upload'
							type='file'
							name='image'
							accept='video/*'
							onChange={(e) => {
								const file = e.target.files ? e.target.files[0] : null
								if (file) {
									const url = URL.createObjectURL(file)
									setVideoUrl(url)
									setVideoFile(file)
								}
							}}
							style={{ display: 'none' }}
						/>

						{imgUrl && (
							<button className='settings__btn-delete' onClick={deleteImg}>
								Удалить изображение
							</button>
						)}
						<img
							className='form-block__img-upload'
							src={`${process.env.REACT_APP_SERVER_URL}/uploads/previews/${imgUrl}`}
							alt=''
						/>
					</div>
					<div className='form-block__btns-login'>
						<button type='submit' className='button button-login button--footer'>
							Добавить
						</button>
					</div>
				</form>
			</div>

			{videoUrl && (
				<div className='video-preview'>
					<h4>Предпросмотр видео:</h4>
					<video controls width='600'>
						<source src={videoUrl} type='video/mp4' />
						Ваш браузер не поддерживает видео.
					</video>
				</div>
			)}
		</div>
	)
}

export default AddVideoForm

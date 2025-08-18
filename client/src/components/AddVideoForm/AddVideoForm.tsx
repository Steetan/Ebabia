import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { LinearProgress, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { customAxiosFile } from '../../utils/axiosFile'
import { getDate } from '../../utils/getDate'

export interface FormData {
	title: string
	description: string
}

const AddVideoForm: React.FC = () => {
	const { isAuth } = useSelector((state: RootState) => state.authSlice)
	const [videoUrl, setVideoUrl] = React.useState<string | null>(null)
	const [videoFile, setVideoFile] = React.useState<File | null>(null)
	const [uploadProgress, setUploadProgress] = React.useState<number>(0)
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
			formData.append('data', getDate())

			const xhr = new XMLHttpRequest()
			xhr.open('POST', `${process.env.REACT_APP_SERVER_URL}/addvideo`, true)

			xhr.upload.onprogress = (event) => {
				if (event.lengthComputable) {
					const percentComplete = (event.loaded / event.total) * 100
					setUploadProgress(percentComplete)
				}
			}

			xhr.onload = () => {
				if (xhr.status === 201) {
					navigate('/')
				} else {
					console.error('Ошибка при загрузке видео', xhr.responseText)
				}
			}
			xhr.onerror = () => {
				console.error('Ошибка сети')
			}

			xhr.send(formData)
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
		<div className='form-block-wrapper adminpanel__form'>
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
							multiline
							rows={4}
							maxRows={4}
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
					{!uploadProgress && (
						<div className='form-block__btns-login'>
							<button type='submit' className='button button-login button--footer'>
								Добавить
							</button>
						</div>
					)}
					{uploadProgress > 0 && (
						<div>
							<div className='progress-bar'>
								<LinearProgress variant='determinate' value={uploadProgress} />
								<p>{Math.round(uploadProgress)}%</p>
							</div>
						</div>
					)}
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

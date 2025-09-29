import React, { ChangeEvent } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { TextField } from '@mui/material'
import { customAxios } from '../../utils/axios'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { fetchFile } from '../../utils/fetchFile'
import { deleteImg } from '../../utils/deleteImg'

export interface FormData {
	title: string
	description: string
}

const AddNewsForm: React.FC = () => {
	const { isAuth } = useSelector((state: RootState) => state.authSlice)
	const [imgUrl, setImgUrl] = React.useState<any>(null)
	const navigate = useNavigate()

	const inputFileRef = React.useRef<HTMLInputElement>(null)
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>()

	const onSubmit: SubmitHandler<FormData> = async (data) => {
		const formData = new FormData()
		formData.append('description', data.description)
		formData.append('imageUrl', imgUrl)

		try {
			await customAxios(`/news`, 'post', {
				description: data.description,
				imgUrl,
			}).then(() => {})
		} catch (error) {
			console.error('Ошибка при добавлении', error)
		}
	}

	!isAuth && navigate('/')

	return (
		<div className='form-block-wrapper'>
			<div className='form-block'>
				<h3 className='form-block__title'>Добавить новость</h3>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className='form-block__inputs'>
						<TextField
							id='outlined-basic'
							label='Описание'
							multiline
							rows={4}
							maxRows={4}
							sx={{
								'& .MuiInputBase-input': {
									color: '#fff',
								},
								'& .MuiInputBase-input::placeholder': {
									color: '#fff',
								},
							}}
							variant='outlined'
							{...register('description')}
						/>
						{!imgUrl && (
							<label htmlFor='file-upload-image-news' className='custom-file-upload'>
								Загрузить фото
							</label>
						)}
						<input
							id='file-upload-image-news'
							ref={inputFileRef}
							type='file'
							accept='image/*'
							style={{ display: 'none' }}
							onChange={async (event: ChangeEvent<HTMLInputElement>) => setImgUrl(await fetchFile(event, '/newsprev'))}
						/>

						{imgUrl && (
							<button className='settings__btn-delete' onClick={() => deleteImg(setImgUrl, inputFileRef, `/newsprev/${imgUrl}`)}>
								Удалить изображение
							</button>
						)}
						<img
							className='form-block__img-upload'
							src={`${process.env.REACT_APP_SERVER_URL}/uploads/news/${imgUrl}`}
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
		</div>
	)
}

export default AddNewsForm

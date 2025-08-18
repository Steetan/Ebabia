import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { TextField } from '@mui/material'
import { customAxios } from '../utils/axios'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../redux/store'
import { setData, setIsAuth, setUserImgUrl } from '../redux/slices/authSlice'
import Cookies from 'js-cookie'
import { customAxiosFile } from '../utils/axiosFile'
import MobileBlock from '../components/MobileBlock/MobileBlock'

export interface FormData {
	name: string
	fname?: string
	email: string
	password: string
}

const Registration = ({}) => {
	const inputFileRef = React.useRef<HTMLInputElement>(null)
	const { userImgUrl } = useSelector((state: RootState) => state.authSlice)

	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>()

	const handleFileChange = async (event: any) => {
		try {
			const formData = new FormData()
			formData.append('image', event.target.files[0])

			await customAxiosFile(`/userimage`, 'post', formData).then((data: { url: string }) => {
				try {
					dispatch(setUserImgUrl(`${data.url}`))
				} catch (error) {
					console.log(error)
					alert('Не удалось обновить аватарку')
				}
			})
		} catch (error) {
			console.warn(error)
		}
	}

	const deleteImg = async () => {
		try {
			customAxiosFile(`/userimage/${userImgUrl}`, 'delete')
			if (inputFileRef.current) {
				inputFileRef.current.value = ''
			}
			dispatch(setUserImgUrl(''))
		} catch (error) {
			console.log(error)
		}
	}

	const onSubmit: SubmitHandler<FormData> = async (data) => {
		const formData = new FormData()
		formData.append('name', data.name)
		formData.append('fname', data.fname || '')
		formData.append('email', data.email)
		formData.append('password', data.password)

		try {
			await customAxios('/auth/reg', 'post', {
				name: data.name,
				fname: data.fname,
				email: data.email,
				password: data.password,
				imgUrl: userImgUrl,
			}).then((data) => {
				Cookies.set('token', data.token, { expires: 30 })
				dispatch(setData({ name: data.name, fname: data.fname, email: data.email }))
				dispatch(setIsAuth(true))
				navigate('/')
			})
		} catch (error) {
			console.error('Ошибка при загрузке видео', error)
		}
	}

	return (
		<div className='auth'>
			<MobileBlock />
			<div className='form-block-wrapper'>
				<div className='form-block'>
					<h3 className='form-block__title'>Регистрация</h3>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className='form-block__inputs'>
							<TextField
								error={errors.name && true}
								id='outlined-basic'
								className='form-block__input'
								label='Имя'
								variant='outlined'
								{...register('name', { required: 'Укажите имя' })}
							/>
							{errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
							<TextField
								id='outlined-basic'
								label='Фамилия (не обязательно)'
								className='form-block__input'
								variant='outlined'
								{...register('fname')}
							/>
							<TextField
								error={errors.email && true}
								id='outlined-basic'
								label='Email'
								type='email'
								className='form-block__input'
								variant='outlined'
								{...register('email', { required: 'Укажите почту' })}
							/>
							{errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
							<TextField
								error={errors.password && true}
								id='outlined-basic'
								label='Пароль'
								className='form-block__input'
								variant='outlined'
								type='password'
								{...register('password', { required: 'Укажите пароль' })}
							/>
							{errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
							{!userImgUrl && (
								<label htmlFor='file-upload' className='custom-file-upload'>
									Загрузить фото
								</label>
							)}
							<input
								id='file-upload'
								ref={inputFileRef}
								type='file'
								accept='image/*'
								style={{ display: 'none' }}
								onChange={handleFileChange}
							/>

							{userImgUrl && (
								<button className='settings__btn-delete' onClick={deleteImg}>
									Удалить изображение
								</button>
							)}
							<img
								className='form-block__img-upload'
								src={`${process.env.REACT_APP_SERVER_URL}/uploads/userIcons/${userImgUrl}`}
								alt=''
							/>
						</div>
						<div className='form-block__btns'>
							<button type='submit' className='button button--footer'>
								Зарегистрироваться
							</button>
							<p>
								Есть аккаунт?
								<Link to='/auth/login' className='button-link-reg'>
									{' '}
									Войти
								</Link>
							</p>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default Registration

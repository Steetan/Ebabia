import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FormControlLabel, Switch, TextField } from '@mui/material'
import { customAxios } from '../utils/axios'
import Cookies from 'js-cookie'
import { useAppDispatch } from '../redux/store'
import { setData, setIsAdmin, setIsAuth } from '../redux/slices/authSlice'
import MobileBlock from '../components/MobileBlock/MobileBlock'

export interface FormData {
	email: string
	password: string
}

const Login = ({}) => {
	const [isChecked, setIsChecked] = React.useState(false)

	const dispatch = useAppDispatch()

	const navigate = useNavigate()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({ mode: 'onChange' })

	const onSubmit: SubmitHandler<FormData> = async (data) => {
		const formData = new FormData()
		formData.append('email', data.email)
		formData.append('password', data.password)

		try {
			await customAxios(`/auth/login?email=${data.email}&password=${data.password}`, 'get').then(
				(data) => {
					if (data.access) {
						Cookies.set('token', data.token, { expires: 30 })
						dispatch(setData({ name: data.name, fname: data.fname, email: data.email }))
						dispatch(setIsAuth(true))
						data.isAdmin && dispatch(setIsAdmin(true))
						navigate('/')
					} else {
						alert(data.message)
					}
				},
			)
		} catch (error) {
			console.error('Ошибка при попытке авторизации', error)
		}
	}

	return (
		<div className='auth'>
			<MobileBlock />
			<div className='form-block-wrapper'>
				<div className='form-block'>
					<h3 className='form-block__title'>Вход</h3>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className='form-block__inputs'>
							<TextField
								error={errors.email && true}
								id='outlined-basic'
								label='Email'
								variant='outlined'
								{...register('email', { required: 'Укажите почту' })}
							/>
							{errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
							<TextField
								error={errors.password && true}
								id='outlined-basic'
								label='Пароль'
								type={isChecked ? 'text' : 'password'}
								variant='outlined'
								{...register('password', { required: 'Укажите пароль' })}
							/>
							{errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
							<FormControlLabel
								value={isChecked}
								onChange={() => setIsChecked(!isChecked)}
								control={<Switch />}
								label='Показать пароль'
							/>
						</div>
						<div className='form-block__btns-login'>
							<button type='submit' className='button button-login button--footer'>
								Войти
							</button>
							<p>
								Нет аккаунта?
								<Link to='/auth/reg' className='button-link-reg'>
									{' '}
									Зарегистрироваться
								</Link>
							</p>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default Login

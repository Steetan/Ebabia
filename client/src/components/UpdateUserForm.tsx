import { TextField } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'
import { customAxios } from '../utils/axios'
import { UserData } from '../pages/UserSettings/UserSettings'
import Cookies from 'js-cookie'

export const UpdateUserForm = ({}) => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<UserData>()

	const [loading, setLoading] = React.useState(true)

	React.useEffect(() => {
		try {
			customAxios(`/meinfo?token=${Cookies.get('token')}`, 'get').then((data: any) => {
				setValue('name', data.name)
				setValue('fname', data.fname)
				setValue('email', data.email)
				setLoading(false)
				console.log(data)
			})
		} catch (error) {
			console.log(error)
		}
	}, [])

	const onSubmit = async (values: UserData) => {
		try {
			const data = await customAxios(`/auth/update?token=${Cookies.get('token')}`, 'patch', {
				...values,
			})

			console.log(data)
			Cookies.remove('token')
			Cookies.set('token', data.token)
		} catch (error) {
			console.log(error)
			alert('Не удалось обновить данные')
		}
	}

	if (loading) {
		return <p>Загрузка данных</p>
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className='form-block'>
				<h3 className='form-block__title'>Обновление данных</h3>
				<TextField
					id='outlined-basic'
					label='Фамилия'
					className='form-block__input form-block__input--update'
					variant='outlined'
					{...register('fname', { required: 'Укажите фамилию' })}
				/>
				{errors.fname && <p style={{ color: 'red' }}>{errors.fname.message}</p>}
				<TextField
					id='outlined-basic'
					label='Имя'
					className='form-block__input form-block__input--update'
					variant='outlined'
					{...register('name', { required: 'Укажите имя' })}
				/>
				{errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
				<TextField
					id='outlined-basic'
					label='Email'
					type='email'
					className='form-block__input form-block__input--update'
					variant='outlined'
					{...register('email', { required: 'Укажите email' })}
				/>
				{errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}

				<button type='submit' className='button button--footer'>
					Обновить
				</button>
			</div>
		</form>
	)
}

export default UpdateUserForm

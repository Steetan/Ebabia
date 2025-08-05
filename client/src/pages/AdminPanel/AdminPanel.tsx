import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { TextField } from '@mui/material'
import { customAxios } from '../../utils/axios'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import Cookies from 'js-cookie'
import AddVideoForm from '../../components/AddVideoForm/AddVideoForm'
import AddNewsForm from '../../components/AddNewsForm/AddNewsForm'

const AdminPanel: React.FC = () => {
	const { dataUser } = useSelector((state: RootState) => state.authSlice)
	const navigation = useNavigate()

	React.useEffect(() => {
		if (!dataUser.is_admin) {
			navigation('/')
		}
	}, [])

	return (
		<div className='adminpanel'>
			<AddVideoForm />
			<AddNewsForm />
		</div>
	)
}

export default AdminPanel

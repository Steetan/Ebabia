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
	return (
		<div className='adminpanel'>
			<AddVideoForm />
			<AddNewsForm />
		</div>
	)
}

export default AdminPanel

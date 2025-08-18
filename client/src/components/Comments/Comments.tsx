import React from 'react'
import Comment from '../Comment/Comment'
import { customAxios } from '../../utils/axios'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { getDate } from '../../utils/getDate'

const Comments: React.FC = ({}) => {
	const [searchParams, setSearchParams] = useSearchParams()
	const searchTerm = searchParams.get('look')

	const [fetchComments, setFetchComments] = React.useState([])

	const { isAuth } = useSelector((state: RootState) => state.authSlice)

	const { register, handleSubmit, setValue } = useForm<any>()

	const fetchData = async () => {
		customAxios(`/comments?look=${searchTerm}`, 'get').then((fetData) => {
			setFetchComments(fetData)
		})
	}
	React.useEffect(() => {
		fetchData()
	}, [])

	const onSubmit = async (values: any) => {
		const formData = new FormData()
		formData.append('description', values.description)

		try {
			await customAxios(`/comments`, 'post', {
				description: values.description,
				videoid: searchTerm,
				data: getDate(),
			}).then(() => {
				fetchData()
			})
		} catch (error) {
			console.error('Ошибка при добавлении', error)
		}
	}

	return (
		<div className='comments'>
			<div className='fullvideo__comments'>
				<h1 className='fullvideo__comments-title'>Комментарии</h1>
				{isAuth && (
					<div className='reviews__create-block'>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className='form-block__inputs'>
								<TextField
									placeholder='Описание'
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
			</div>
			{fetchComments.length ? (
				fetchComments.map((item: any) => <Comment key={item.id} {...item} />)
			) : (
				<h1>Пока нет комментариев</h1>
			)}
		</div>
	)
}

export default Comments

import React from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { IVideo } from '../../pages/Video/Video'
import { customAxios } from '../../utils/axios'

const VideoPrev: React.FC<any> = ({ id, preview, title, link }) => {
	const navigate = useNavigate()
	const location = useLocation()
	const [searchParams, setSearchParams] = useSearchParams()
	const searchTerm = searchParams.get('look')

	const redirectPage = () => {
		navigate(`/fullvideo?look=${id}`)
		if (location.pathname === '/fullvideo') {
			window.location.reload()
		}
	}

	const onDeleteVideo = () => {
		if (window.confirm('Вы действительно хотите удалить видео?')) {
			try {
				customAxios(`/video?id=${id}&prevname=${preview}&videoname=${link}`, 'delete').then(
					(data) => {
						alert('Видео было успешно удалено')
					},
				)
			} catch (error) {
				console.log(error)
			}
		}
	}

	if (searchTerm === id) {
		return null
	}

	return (
		<div>
			<div
				className={`video-prev ${
					location.pathname === '/fullvideo' || location.pathname === '/quest'
						? 'video-prev--desc'
						: ''
				}`}
				onClick={redirectPage}
			>
				<div className='video-prev__img'>
					<img
						src={`${process.env.REACT_APP_SERVER_URL}/uploads/previews/${preview}`}
						alt={title}
					/>
				</div>
				<div className='video-prev__title'>{title}</div>
			</div>
			<button onClick={onDeleteVideo}>Удалить</button>
		</div>
	)
}

export default VideoPrev

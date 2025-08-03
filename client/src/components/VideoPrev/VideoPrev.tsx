import React from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { IVideo } from '../../pages/News/News'

const VideoPrev: React.FC<IVideo> = ({ id, preview, title, link, description }) => {
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

	if (searchTerm === id) {
		return null
	}

	return (
		<div
			className={`video-prev ${
				location.pathname === '/fullvideo' || location.pathname === '/quest'
					? 'video-prev--desc'
					: ''
			}`}
			onClick={redirectPage}
		>
			<div className='video-prev__img'>
				<img src={`${process.env.REACT_APP_SERVER_URL}/uploads/previews/${preview}`} alt={title} />
			</div>
			<div className='video-prev__title'>{title}</div>
		</div>
	)
}

export default VideoPrev

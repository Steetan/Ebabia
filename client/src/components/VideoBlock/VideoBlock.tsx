import React from 'react'
import { IVideo } from '../../pages/Home'
import { useSearchParams } from 'react-router-dom'
import { useVideos } from '../../utils/fetchData'
import { customAxios } from '../../utils/axios'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

const VideoBlock: React.FC<any> = ({ video }) => {
	const [searchParams, setSearchParams] = useSearchParams()
	const searchTerm = searchParams.get('look')
	const [fetchCurrentVideo, setFetchCurrentVideo] = React.useState<any>(null)

	const { userImgUrl } = useSelector((state: RootState) => state.authSlice)

	React.useEffect(() => {
		const fetchData = async () => {
			customAxios(`/video?look=${searchTerm}`, 'get').then((fetData) => {
				setFetchCurrentVideo(fetData)
			})
		}
		fetchData()
	}, [])

	return (
		<div className='video-block'>
			<video
				src={`${process.env.REACT_APP_SERVER_URL}/uploads/videos/${fetchCurrentVideo?.link}`}
				controls
			></video>
			<h3 className='video-block__title'>{fetchCurrentVideo?.title}</h3>
			<div className='video-block__author'>
				<div className='btn-avatar'>
					{userImgUrl && (
						<img
							className='btn-avatar-img'
							src={`${process.env.REACT_APP_SERVER_URL}/uploads/userIcons/${fetchCurrentVideo?.icon_url}`}
							alt='ava'
						/>
					)}
					{!userImgUrl && (
						<svg
							version='1.0'
							xmlns='http://www.w3.org/2000/svg'
							width='512.000000pt'
							style={{ height: 'auto', width: 50 }}
							height='512.000000pt'
							viewBox='0 0 512.000000 512.000000'
							preserveAspectRatio='xMidYMid meet'
						>
							<g
								transform='translate(0.000000,512.000000) scale(0.100000,-0.100000)'
								fill={'#000'}
								stroke='none'
							>
								<path
									d='M2377 5104 c-93 -14 -240 -60 -322 -101 -151 -75 -310 -209 -414
					-348 -118 -156 -205 -387 -219 -582 -16 -225 20 -410 118 -608 165 -334 471
					-560 840 -620 278 -45 560 15 801 170 292 189 492 521 517 862 16 219 -20 409
					-112 598 -91 185 -225 341 -388 448 -105 70 -161 97 -274 136 -169 58 -364 74
					-547 45z'
								/>
								<path
									d='M2320 2545 c-358 -44 -699 -184 -992 -406 -106 -81 -286 -260 -366
					-366 -231 -305 -371 -653 -411 -1025 -23 -212 -12 -325 45 -444 59 -125 178
					-229 313 -276 l66 -23 1585 0 1585 0 66 23 c135 47 254 151 313 276 57 119 68
					232 45 444 -40 372 -180 720 -411 1025 -80 106 -260 285 -366 366 -426 323
					-958 469 -1472 406z'
								/>
							</g>
						</svg>
					)}
				</div>
				<h5 className='video-block__author-title'>{fetchCurrentVideo?.name}</h5>
			</div>

			<p className='video-block__title'>
				<b>Описание:</b> <br />
				<br />
				{fetchCurrentVideo?.description}
			</p>
		</div>
	)
}

export default VideoBlock

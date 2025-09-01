import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { customAxios } from '../../utils/axios'
import Comments from '../../components/Comments/Comments'
import { translateOneDateWithoutTime } from '../../utils/translateOneDateWithoutTime'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

const FullVideo: React.FC = () => {
	const { dataUser } = useSelector((state: RootState) => state.authSlice)
	const [searchParams, setSearchParams] = useSearchParams()
	const searchTerm = searchParams.get('look')
	const [fetchCurrentVideo, setFetchCurrentVideo] = React.useState<any>(null)
	const [isLiked, setIsLiked] = React.useState<boolean | null>(null)
	const [ratings, setRatings] = React.useState({
		likes: 0,
		dislikes: 0,
	})

	const fetchDataVideo = async () => {
		customAxios(`/video?look=${searchTerm}`, 'get').then((fetData) => {
			setFetchCurrentVideo(fetData)
		})
	}

	const fetchLikes = async () => {
		customAxios(`/videolikes?id=${searchTerm}`, 'get').then((fetData: any) => {
			setRatings({
				...ratings,
				likes: fetData.likes,
				dislikes: fetData.disLikes,
			})
			setIsLiked(fetData.userLike)
		})
	}
	React.useEffect(() => {
		const fetchData = async () => {
			try {
				await Promise.all([fetchDataVideo(), fetchLikes()])
			} catch (err) {
				console.log(err)
			}
		}

		fetchData()
	}, [searchTerm])

	const onClickRating = (rating: boolean) => {
		if (isLiked === null) {
			console.log('1')
			customAxios(`/videolike?id=${searchTerm}&rating=${rating}`, 'post').then(() => {
				if (rating) {
					setRatings((prev) => ({
						...prev,
						likes: prev.likes + 1,
					}))
					setIsLiked(true)
				}
				if (!rating) {
					setRatings((prev) => ({
						...prev,
						dislikes: prev.dislikes + 1,
					}))
					setIsLiked(false)
				}
			})
		}
		if (rating === isLiked && isLiked !== null) {
			console.log('2')
			customAxios(`/videolike?id=${searchTerm}`, 'delete').then(() => {
				setRatings((prev) => ({
					...prev,
					likes: rating ? prev.likes - 1 : prev.likes,
					dislikes: !rating ? prev.dislikes - 1 : prev.dislikes,
				}))
				setIsLiked(null)
			})
		}
		if (rating !== isLiked && isLiked !== null) {
			const updateLike = async () => {
				await customAxios(`/videolike?id=${searchTerm}`, 'delete').then(() => {
					setRatings((prev) => ({
						...prev,
						likes: !rating ? prev.likes - 1 : prev.likes,
						dislikes: rating ? prev.dislikes - 1 : prev.dislikes,
					}))
				})
				await customAxios(`/videolike?id=${searchTerm}&rating=${rating}`, 'post').then(() => {
					if (rating) {
						setRatings((prev) => ({
							...prev,
							likes: prev.likes + 1,
						}))
						setIsLiked(true)
					}
					if (!rating) {
						setRatings((prev) => ({
							...prev,
							dislikes: prev.dislikes + 1,
						}))
						setIsLiked(false)
					}
				})
				setIsLiked(rating)
			}
			updateLike()
		}
	}

	return (
		<div className='fullvideo'>
			<div className='fullvideo__block'>
				<div className='fullvideo__left'>
					<video
						className='fullvideo__video'
						src={`${process.env.REACT_APP_SERVER_URL}/uploads/videos/${fetchCurrentVideo?.link}`}
						controls
					></video>
					<div className='fullvideo__like-blocks'>
						<div className='fullvideo__like-block' onClick={() => onClickRating(true)}>
							<svg
								viewBox='0 -0.5 21 21'
								version='1.1'
								xmlns='http://www.w3.org/2000/svg'
								xmlnsXlink='http://www.w3.org/1999/xlink'
								fill='#ffffff'
								width='25'
							>
								<g id='SVGRepo_bgCarrier' stroke-width='0'></g>
								<g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g>
								<g id='SVGRepo_iconCarrier'>
									{' '}
									<title>like [#1386]</title> <desc>Created with Sketch.</desc> <defs> </defs>{' '}
									<g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'>
										{' '}
										<g
											id='Dribbble-Light-Preview'
											transform='translate(-219.000000, -760.000000)'
											fill={isLiked ? '#f54242' : '#fff'}
										>
											{' '}
											<g id='icons' transform='translate(56.000000, 160.000000)'>
												{' '}
												<path
													d='M163,610.021159 L163,618.021159 C163,619.126159 163.93975,620.000159 165.1,620.000159 L167.199999,620.000159 L167.199999,608.000159 L165.1,608.000159 C163.93975,608.000159 163,608.916159 163,610.021159 M183.925446,611.355159 L182.100546,617.890159 C181.800246,619.131159 180.639996,620.000159 179.302297,620.000159 L169.299999,620.000159 L169.299999,608.021159 L171.104948,601.826159 C171.318098,600.509159 172.754498,599.625159 174.209798,600.157159 C175.080247,600.476159 175.599997,601.339159 175.599997,602.228159 L175.599997,607.021159 C175.599997,607.573159 176.070397,608.000159 176.649997,608.000159 L181.127196,608.000159 C182.974146,608.000159 184.340196,609.642159 183.925446,611.355159'
													id='like-[#1386]'
												>
													{' '}
												</path>{' '}
											</g>{' '}
										</g>{' '}
									</g>{' '}
								</g>
							</svg>
							<div className='fullvideo__like-count'>{ratings.likes}</div>
						</div>
						<div className='fullvideo__like-block' onClick={() => onClickRating(false)}>
							<svg
								viewBox='0 -0.5 21 21'
								version='1.1'
								xmlns='http://www.w3.org/2000/svg'
								xmlnsXlink='http://www.w3.org/1999/xlink'
								width='25'
							>
								<g id='SVGRepo_bgCarrier' stroke-width='0'></g>
								<g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g>
								<g id='SVGRepo_iconCarrier'>
									{' '}
									<title>dislike [#1388]</title> <desc>Created with Sketch.</desc> <defs> </defs>{' '}
									<g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'>
										{' '}
										<g
											id='Dribbble-Light-Preview'
											transform='translate(-139.000000, -760.000000)'
											fill={isLiked === false && isLiked !== null ? '#f54242' : '#fff'}
										>
											{' '}
											<g id='icons' transform='translate(56.000000, 160.000000)'>
												{' '}
												<path
													d='M101.900089,600 L99.8000892,600 L99.8000892,611.987622 L101.900089,611.987622 C103.060339,611.987622 104.000088,611.093545 104.000088,609.989685 L104.000088,601.997937 C104.000088,600.894077 103.060339,600 101.900089,600 M87.6977917,600 L97.7000896,600 L97.7000896,611.987622 L95.89514,618.176232 C95.6819901,619.491874 94.2455904,620.374962 92.7902907,619.842512 C91.9198408,619.52484 91.400091,618.66273 91.400091,617.774647 L91.400091,612.986591 C91.400091,612.43516 90.9296911,611.987622 90.3500912,611.987622 L85.8728921,611.987622 C84.0259425,611.987622 82.6598928,610.35331 83.0746427,608.641078 L84.8995423,602.117813 C85.1998423,600.878093 86.360092,600 87.6977917,600'
													id='dislike-[#1388]'
												>
													{' '}
												</path>{' '}
											</g>{' '}
										</g>{' '}
									</g>{' '}
								</g>
							</svg>
							<div className='fullvideo__like-count'>{ratings.dislikes}</div>
						</div>
					</div>
				</div>
				<div className='fullvideo__block-right'>
					<div className='fullvideo__top'>
						<h3 className='fullvideo__title'>{fetchCurrentVideo?.title}</h3>
						<h4 className='fullvideo__data'>
							{translateOneDateWithoutTime(fetchCurrentVideo?.data)}
						</h4>
					</div>
					<p className='fullvideo__desc'>{fetchCurrentVideo?.description}</p>
				</div>
			</div>
			<Comments />
		</div>
	)
}

export default FullVideo

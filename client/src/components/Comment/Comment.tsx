import React from 'react'
import { translateOneDate } from '../../utils/translateOneDate'

const Comment: React.FC<{
	description: string
	name: string
	fname: string
	icon_url: string
	data: any
}> = ({ description, name, fname, icon_url, data }) => {
	return (
		<div className='fullvideo__comment'>
			<div className='fullvideo__comment-top'>
				{icon_url && (
					<img
						src={`${process.env.REACT_APP_SERVER_URL}/uploads/userIcons/${icon_url}`}
						alt=''
						className='fullvideo__comment-img'
					/>
				)}
				{!icon_url && (
					<svg
						version='1.0'
						xmlns='http://www.w3.org/2000/svg'
						width='512.000000pt'
						style={{ height: 'auto', width: 30 }}
						height='512.000000pt'
						viewBox='0 0 512.000000 512.000000'
						preserveAspectRatio='xMidYMid meet'
					>
						<g
							transform='translate(0.000000,512.000000) scale(0.100000,-0.100000)'
							fill={'#000000'}
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
				<div className='fullvideo__comment-block'>
					<h4>{`${name} ${fname}`}</h4>
					<h5 className='fullvideo__comment-data'>{translateOneDate(data)}</h5>
				</div>
			</div>
			<p className='fullvideo__comment-desc'>{description}</p>
		</div>
	)
}

export default Comment

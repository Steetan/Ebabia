import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { RootState } from '../../redux/store'

const AsideNavItem: React.FC<{ link: string; title: string; isActive: boolean }> = ({
	link,
	title,
	isActive,
}) => {
	const { isAuth } = useSelector((state: RootState) => state.authSlice)
	const location = useLocation()

	const icon = link.toString().replace('/', '')

	console.log(icon)

	return (
		<Link
			to={link}
			className={isActive ? 'aside__nav-item aside__nav-item--home aside__nav-item--active' : 'aside__nav-item aside__nav-item--home'}
		>
			<img
				src={require(`../../assets/${icon ? icon : `news`}-aside.png`)}
				alt=''
				className='aside__nav-img'
			/>
			{title}
		</Link>
	)
}

export default AsideNavItem

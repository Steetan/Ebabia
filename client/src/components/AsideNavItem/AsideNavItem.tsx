import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { RootState } from '../../redux/store'

const AsideNavItem: React.FC<{ link: string; title: string }> = ({ link, title }) => {
	const { isAuth } = useSelector((state: RootState) => state.authSlice)

	return (
		<Link to={link} className='aside__nav-item'>
			{title}
		</Link>
	)
}

export default AsideNavItem

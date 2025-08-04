import React from 'react'
import AsideNav from '../AsideNav/AsideNav'
import { useLocation } from 'react-router-dom'

const Aside: React.FC = () => {
	const location = useLocation()

	return location.pathname === '/' ||
		location.pathname === '/video' ||
		location.pathname === '/fullvideo' ||
		location.pathname === '/chat' ? (
		<div className='aside'>
			<AsideNav />
		</div>
	) : null
}

export default Aside

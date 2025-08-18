import React from 'react'
import AsideNavItem from '../AsideNavItem/AsideNavItem'
import { useLocation } from 'react-router-dom'

const AsideNav: React.FC = ({}) => {
	const location = useLocation()

	return (
		<div className='aside-nav'>
			<AsideNavItem
				link={`/`}
				title={`Новости`}
				isActive={location.pathname == '/' ? true : false}
			/>
			<AsideNavItem
				link={`/video`}
				title={`Видео`}
				isActive={location.pathname == '/video' || location.pathname == '/fullvideo' ? true : false}
			/>
			<AsideNavItem
				link={`/chat`}
				title={`Общий чат`}
				isActive={location.pathname == '/chat' ? true : false}
			/>
		</div>
	)
}

export default AsideNav

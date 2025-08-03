import React from 'react'
import AsideNavItem from '../AsideNavItem/AsideNavItem'

const AsideNav: React.FC = ({}) => {
	return (
		<div className='aside-nav'>
			<AsideNavItem link={`/`} title={`Новости`} />
			<AsideNavItem link={`/video`} title={`Видео`} />
			<AsideNavItem link={`/chat`} title={`Общий чат`} />
		</div>
	)
}

export default AsideNav

import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
// import Aside from '../components/Aside/Aside'
import Header from '../components/Header/Header'
import Aside from '../components/Aside/Aside'

const Layout = () => {
	const location = useLocation()

	return (
		<div className='main'>
			<Header />
			<div className='wrapper'>
				<div className='container'>
					<div className='wrapper__inner'>
						<Aside />
						<div className={location.pathname === '/quest' ? 'content content--quest' : 'content'}>
							<Outlet />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Layout

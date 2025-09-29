import { Outlet, useLocation } from 'react-router-dom'
import Header from '../components/Header/Header'
import Aside from '../components/Aside/Aside'

const Layout = () => {
	const location = useLocation()

	return (
		<div className='main'>
			<Header />
			<div className='wrapper'>
				<div className='container'>
					<div
						className='wrapper__inner'
						style={
							location.pathname === '/auth/login' || location.pathname === '/auth/reg'
								? { justifyContent: 'center' }
								: {}
						}
					>
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

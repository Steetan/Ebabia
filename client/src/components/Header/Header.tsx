import React from 'react'
import Logo from '../Logo/Logo'
import { Link } from 'react-router-dom'
import Search from '../Search/Search'
import { customAxios } from '../../utils/axios'
import Cookies from 'js-cookie'
import axios from 'axios'
import { RootState, useAppDispatch } from '../../redux/store'
import { setData, setIsAuth } from '../../redux/slices/authSlice'
import { useSelector } from 'react-redux'
import PopupMenu from '../PopupMenu/PopupMenu'

const Header = ({}) => {
	const [isVisiblePopup, setIsVisiblePopup] = React.useState(false)

	const dispatch = useAppDispatch()

	const { isAuth } = useSelector((state: RootState) => state.authSlice)

	return (
		<header className='header'>
			<div className='container'>
				<div className='header__inner'>
					<Logo />
					{!isAuth && (
						<Link to='/auth/login'>
							{' '}
							<span>Войти</span>
						</Link>
					)}
					<PopupMenu setIsVisiblePopup={setIsVisiblePopup} />
				</div>
			</div>
		</header>
	)
}

export default Header

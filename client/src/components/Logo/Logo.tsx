import React from 'react'
import { Link } from 'react-router-dom'

const Logo = ({}) => {
	return (
		<Link to='/'>
			<div className='logo'>
				<div className='logo__img'>
					<img src={require('../../assets/logo.png')} alt='' />
				</div>
				<h4 className='logo__title'>ЕБАБЯ</h4>
			</div>
		</Link>
	)
}

export default Logo

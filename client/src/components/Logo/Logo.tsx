import React from 'react'
import { Link } from 'react-router-dom'

const Logo = ({}) => {
	return (
		<Link to='/'>
			<div className='logo'>
				<div className='logo__img'>
					<img src={require('../../assets/logo.png')} alt='' />
				</div>
				<div>
					<h4 className='logo__title'>ЕБАБЯ</h4>
					<h6 className='logo__subtitle'>только топовый контент</h6>
				</div>
			</div>
		</Link>
	)
}

export default Logo

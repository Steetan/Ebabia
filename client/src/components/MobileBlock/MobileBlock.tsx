import React from 'react'

const MobileBlock = () => {
	return (
		<div className='mobile-block'>
			<h1 className='mobile-block__title'>Авторизуйся и получи доступ к эксклюзивным функциям! </h1>
			<img className='mobile-block__img' src={require('../../assets/loginLogo.jpg')} alt='' />
		</div>
	)
}

export default MobileBlock

import React from 'react'

const MobileBlock = () => {
	return (
		<div className='mobile-block'>
			<h1 className='mobile-block__title'>Скачивай мобильное приложение на андроид</h1>
			<img className='mobile-block__img' src={require('../../assets/mobile.jpg')} alt='' />
			<a
				className='button'
				href='https://drive.usercontent.google.com/u/0/uc?id=1Vtcez85ICfnZVYTcfZWsqMbjXmhRd_Gb&export=download'
			>
				скачать
			</a>
		</div>
	)
}

export default MobileBlock

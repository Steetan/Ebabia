import React from 'react'

const NotFound: React.FC = () => {
	return (
		<div className='notFound-block'>
			<h1 className='notFound-emoji'>404</h1>
			<br />
			<h2 className='notFound-text'>Тут ничего нет</h2>
			<p className='notFound-subtitle'>Данная страница отсутствует</p>
		</div>
	)
}

export default NotFound

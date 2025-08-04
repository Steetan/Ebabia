import React from 'react'
import ContentTop from '../../components/ContentTop/ContentTop'
import { customAxios } from '../../utils/axios'

const NewsBlock: React.FC<{ id: string; description: string; img_link: string }> = ({
	description,
	img_link,
}) => {
	return (
		<div className='news__block'>
			<div className='news__img'>
				<img src={`${process.env.REACT_APP_SERVER_URL}/uploads/news/${img_link}`} alt='' />
			</div>
			<div className='news__desc'>{description}</div>
		</div>
	)
}

export default NewsBlock

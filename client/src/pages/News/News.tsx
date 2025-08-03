import React from 'react'
import ContentTop from '../../components/ContentTop/ContentTop'

export interface IVideo {
	id: string
	link: string
	description?: string
	title: string
	preview: string
}

const News: React.FC = () => {
	const [fetchData, setFetchData] = React.useState<any>([])

	return (
		<div className='news'>
			<ContentTop title='Новости' setFetchData={setFetchData} />
			<div className='news__block'>
				<div className='news__img'>
					<img src={require('../../assets/placeholder.jpg')} alt='' />
				</div>
				<div className='news__desc'>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, quibusdam est,
					deserunt quod cum expedita temporibus dicta nesciunt accusantium corrupti eius, dolorum
					aspernatur quis perferendis alias? Id ad inventore quae vel consequuntur rem incidunt
					ullam ipsa quo blanditiis, est hic doloremque perferendis quidem laboriosam amet atque
					ratione cumque nobis sit!
				</div>
			</div>
		</div>
	)
}

export default News

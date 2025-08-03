import React, { useEffect, useState } from 'react'
import { useVideos } from '../utils/fetchData'
import VideoPrev from '../components/VideoPrev/VideoPrev'

export interface IVideo {
	id: string
	link: string
	description?: string
	category: string
	title: string
	preview: string
}

const Home: React.FC = () => {
	return <h1>Новости</h1>
}

export default Home

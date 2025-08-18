import React, { useEffect, useState } from 'react'
import { useVideos } from '../../utils/fetchData'
import VideoPrev from '../../components/VideoPrev/VideoPrev'
import { Search } from '../Search/Search'
import { IVideo } from '../../pages/Video/Video'
import { useLocation } from 'react-router-dom'

const ContentTop: React.FC<{
	title: string
	setFetchData: React.Dispatch<React.SetStateAction<IVideo[]>>
}> = ({ title, setFetchData }) => {
	const { isLoading, error } = useVideos('/prevvideo')
	const location = useLocation()

	if (isLoading) {
		return <div>Загрузка...</div>
	}

	if (error) {
		return <div>Error loading videos: {error.message}</div>
	}

	return (
		<div className='content-top'>
			<h1 style={{ color: '#fff' }}>{title}</h1>
			{location.pathname !== '/' && <Search setFetchData={setFetchData} />}
		</div>
	)
}

export default ContentTop

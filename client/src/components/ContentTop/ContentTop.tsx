import React, { useEffect, useState } from 'react'
import { useVideos } from '../../utils/fetchData'
import VideoPrev from '../../components/VideoPrev/VideoPrev'
import { Search } from '../Search/Search'
import { IVideo } from '../../pages/Video/Video'

const ContentTop: React.FC<{
	title: string
	setFetchData: React.Dispatch<React.SetStateAction<IVideo[]>>
}> = ({ title, setFetchData }) => {
	const { data, isLoading, error } = useVideos('/prevvideo')

	const searchVideo = (fetchData2: IVideo[]) => {
		setFetchData(fetchData2)
	}

	if (isLoading) {
		return <div>Загрузка...</div>
	}

	if (error) {
		return <div>Error loading videos: {error.message}</div>
	}

	return (
		<div className='content-top'>
			<h1 style={{ color: '#fff' }}>{title}</h1>
			<Search setFetchData={setFetchData} />
		</div>
	)
}

export default ContentTop

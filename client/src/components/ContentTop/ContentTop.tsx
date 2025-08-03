import React, { useEffect, useState } from 'react'
import { useVideos } from '../../utils/fetchData'
import VideoPrev from '../../components/VideoPrev/VideoPrev'
import Search from '../../components/Search/Search'

export interface IVideo {
	id: string
	link: string
	description?: string
	category: string
	title: string
	preview: string
}

const ContentTop: React.FC<{ title: string }> = ({ title }) => {
	const { data, isLoading, error } = useVideos('')
	const [fetchData, setFetchData] = useState<IVideo[]>([])

	useEffect(() => {
		if (Array.isArray(data)) {
			setFetchData(data)
		} else {
			setFetchData([])
		}
	}, [data])

	if (isLoading) {
		return <div>Loading...</div>
	}

	if (error) {
		return <div>Error loading videos: {error.message}</div>
	}

	return (
		<div className='content-top'>
			<h1>{title}</h1>
			<Search />
		</div>
	)
}

export default ContentTop

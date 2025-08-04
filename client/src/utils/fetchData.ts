import { useQuery } from '@tanstack/react-query'

export const useVideos = (url: string) => {
	const fetchVideos = async () => {
		const response = await fetch(`${process.env.REACT_APP_SERVER_URL}${url}`)

		if (!response.ok) {
			throw new Error('Network response was not ok')
		}
		return response.json()
	}
	return useQuery<any>({
		queryKey: ['videos'],
		queryFn: fetchVideos, // Call the fetching function here
	})
}

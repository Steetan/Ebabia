import axios, { AxiosResponse } from 'axios'
import Cookies from 'js-cookie'

type ActionType = 'get' | 'post' | 'put' | 'patch' | 'delete'

export const customAxios = async (url: string, action: ActionType, body?: {}) => {
	const cookie = Cookies.get('token')
	const endpoint = `${process.env.REACT_APP_SERVER_URL}${url}`

	try {
		const response: AxiosResponse = await axios[action](
			endpoint,
			{
				...body,
				headers: {
					Authorization: `Bearer ${cookie}`,
				},
			},
			{
				withCredentials: true,
			},
		)

		return response.data
	} catch (error) {
		console.error(`Error during ${action} request to ${endpoint}, error`)
		return undefined
	}
}

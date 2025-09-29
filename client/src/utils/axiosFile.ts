import axios, { AxiosResponse } from 'axios'
import Cookies from 'js-cookie'

type ActionType = 'get' | 'post' | 'put' | 'patch' | 'delete'

export const customAxiosFile = async (url: string, action: ActionType, body?: {}) => {
	const endpoint = `${process.env.REACT_APP_SERVER_URL}${url}`

	try {
		const response: AxiosResponse = await axios[action](endpoint, body, {
			withCredentials: true,
		})

		return response.data
	} catch (error) {
		console.error(`Error during ${action} request to ${endpoint}, error`)
		return undefined
	}
}

import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'
import Cookies from 'js-cookie'

type TypeAuthState = {
	data: any
	userImgUrl: string
	isAdmin: boolean
	isAuth: boolean
	isDarkTheme: boolean
}

const initialState: TypeAuthState = {
	data: {},
	userImgUrl: '',
	isAdmin: false,
	isAuth: false,
	isDarkTheme: false,
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout: (state) => {
			state.data = {}
			Cookies.remove('token')
		},
		setData: (state, action) => {
			state.data = action.payload
		},
		setUserImgUrl: (state, action) => {
			state.userImgUrl = action.payload
		},
		setIsAdmin: (state, action) => {
			state.isAdmin = action.payload
		},
		setIsAuth: (state, action) => {
			state.isAuth = action.payload
		},
		setIsDarkTheme: (state, action) => {
			state.isDarkTheme = action.payload
		},
	},
})

export const selectIsAuth = (state: RootState) => state.authSlice.data

export const selectIsAuthAdmin = (state: RootState) => Boolean(state.authSlice.data)

export default authSlice.reducer

export const { logout, setData, setUserImgUrl, setIsAdmin, setIsAuth, setIsDarkTheme } =
	authSlice.actions

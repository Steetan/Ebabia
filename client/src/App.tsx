import React from 'react'
import Layout from './layouts/Layout'
import './scss/app.scss'
import Home from './pages/Home'
import Login from './pages/Login'
import Registration from './pages/Registration'
import NotFound from './pages/NotFound/NotFound'
import Video from './pages/Video/Video'
import Quest from './pages/Quest/Quest'
import AddVideo from './pages/AddVideo/AddVideo'
import UserSettings from './pages/UserSettings/UserSettings'
import { Route, Routes } from 'react-router-dom'

const App = () => {
	return (
		<Routes>
			<Route path='/' element={<Layout />}>
				<Route path='' element={<Home />} />
				<Route path='quest' element={<Quest />} />
				<Route path='video' element={<Video />} />
				<Route path='addvideo' element={<AddVideo />} />
				<Route path='auth/login' element={<Login />} />
				<Route path='auth/reg' element={<Registration />} />
				<Route path='userset' element={<UserSettings />} />
				<Route path='*' element={<NotFound />} />
			</Route>
		</Routes>
	)
}

export default App

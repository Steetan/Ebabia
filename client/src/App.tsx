import React from 'react'
import Layout from './layouts/Layout'
import './scss/app.scss'
import Login from './pages/Login'
import Registration from './pages/Registration'
import NotFound from './pages/NotFound/NotFound'
import Video from './pages/Video/Video'
import Quest from './pages/Quest/Quest'
import UserSettings from './pages/UserSettings/UserSettings'
import { Route, Routes, useLocation } from 'react-router-dom'
import FullVideo from './pages/FullVideo/FullVideo'
import News from './pages/News/News'
import AdminPanel from './pages/AdminPanel/AdminPanel'
import Chat from './pages/Chat/Chat'
import { io } from 'socket.io-client'
import About from './pages/About/About'

const App = () => {
	const location = useLocation()
	const socket = location.pathname.includes('/chat')
		? io('http://localhost:6060').connect()
		: io('http://localhost:6060').disconnect()
	return (
		<Routes>
			<Route path='/' element={<Layout />}>
				<Route path='' element={<News />} />
				<Route path='quest' element={<Quest />} />
				<Route path='video' element={<Video />} />
				<Route path='chat' element={<Chat socket={socket} />} />
				<Route path='about' element={<About />} />
				<Route path='fullvideo' element={<FullVideo />} />
				<Route path='adminpanel' element={<AdminPanel />} />
				<Route path='auth/login' element={<Login />} />
				<Route path='auth/reg' element={<Registration />} />
				<Route path='userset' element={<UserSettings />} />
				<Route path='*' element={<NotFound />} />
			</Route>
		</Routes>
	)
}

export default App

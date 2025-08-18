import Cookies from 'js-cookie'
import React from 'react'
import { RootState } from '../../redux/store'
import { useSelector } from 'react-redux'
import { getDate } from '../../utils/getDate'
import { translateDate } from '../../utils/translateDate'
import { translateOneDate } from '../../utils/translateOneDate'

const Chat: React.FC<{ socket: any }> = ({ socket }) => {
	const [inputText, setInputText] = React.useState('')
	const { userImgUrl, dataUser, isAuth } = useSelector((state: RootState) => state.authSlice)
	const messagesEndRef = React.useRef<HTMLDivElement>(null)
	const [typingCurrentUser, setTypingCurrentUser] = React.useState<string | null>(null)

	const [messageArr, setMessageArr] = React.useState<
		{
			sender_id: string
			message: string
			message_id: string
			isCurrentUser: boolean
			sender_name: string
			sender_fname: string
			sender_img: string
			data: any
		}[]
	>([])

	React.useEffect(() => {
		socket.emit('pushConnect', Cookies.get('token'))

		const handleGetMessages = (data: []) => setMessageArr(data)
		const handleNewMessage = (data: any) => {
			setMessageArr((prevMessages) => [...prevMessages, data])
		}

		socket.on('getMessages', handleGetMessages)
		socket.on('newMessage', handleNewMessage)

		return () => {
			socket.off('getMessages', handleGetMessages)
			socket.off('newMessage', handleNewMessage)
		}
	}, [socket])

	React.useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [messageArr])

	const onSubmitMessage = () => {
		if (inputText) {
			socket.emit('pushMessage', {
				token: Cookies.get('token'),
				message: inputText,
				sender_name: dataUser.name,
				sender_fname: dataUser.fname,
				sender_img: userImgUrl,
				data: getDate(),
			})
			setInputText('')
		}
	}

	React.useEffect(() => {
		let typingTimeout: ReturnType<typeof setTimeout> | null = null
		const handleUserTyping = ({ typingUser }: any) => {
			if (typingUser.userId !== dataUser.id) {
				setTypingCurrentUser(typingUser.userName)

				if (typingTimeout) {
					clearTimeout(typingTimeout)
				}
				typingTimeout = setTimeout(() => {
					setTypingCurrentUser(null)
				}, 1000)
			}
		}

		socket.on('userTyping', handleUserTyping)

		return () => {
			socket.off('userTyping', handleUserTyping)
			if (typingTimeout) {
				clearTimeout(typingTimeout)
			}
		}
	}, [socket, dataUser.id])

	const changeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputText(e.target.value)
		socket.emit('typing', {
			typingUser: { userName: dataUser.name, userId: dataUser.id },
		})
	}

	return (
		<div className='chat'>
			<h1 className='chat__title'>Общий чат</h1>
			<div className='chat__block'>
				{messageArr.length
					? messageArr.map((item) => (
							<div
								key={item.message_id}
								className={
									dataUser.id === item.sender_id
										? 'chat__message chat__message--user'
										: 'chat__message'
								}
							>
								{item.sender_img && (
									<img
										src={`${process.env.REACT_APP_SERVER_URL}/uploads/userIcons/${item.sender_img}`}
										alt=''
										className='chat__message-img'
									/>
								)}
								{!item.sender_img && (
									<svg
										version='1.0'
										xmlns='http://www.w3.org/2000/svg'
										width='512.000000pt'
										style={{ height: 'auto', width: 35 }}
										height='512.000000pt'
										viewBox='0 0 512.000000 512.000000'
										preserveAspectRatio='xMidYMid meet'
									>
										<g
											transform='translate(0.000000,512.000000) scale(0.100000,-0.100000)'
											fill={'#000000'}
											stroke='none'
										>
											<path
												d='M2377 5104 c-93 -14 -240 -60 -322 -101 -151 -75 -310 -209 -414
					-348 -118 -156 -205 -387 -219 -582 -16 -225 20 -410 118 -608 165 -334 471
					-560 840 -620 278 -45 560 15 801 170 292 189 492 521 517 862 16 219 -20 409
					-112 598 -91 185 -225 341 -388 448 -105 70 -161 97 -274 136 -169 58 -364 74
					-547 45z'
											/>
											<path
												d='M2320 2545 c-358 -44 -699 -184 -992 -406 -106 -81 -286 -260 -366
					-366 -231 -305 -371 -653 -411 -1025 -23 -212 -12 -325 45 -444 59 -125 178
					-229 313 -276 l66 -23 1585 0 1585 0 66 23 c135 47 254 151 313 276 57 119 68
					232 45 444 -40 372 -180 720 -411 1025 -80 106 -260 285 -366 366 -426 323
					-958 469 -1472 406z'
											/>
										</g>
									</svg>
								)}
								<div>
									<h4 className='chat__message-title'>{item.sender_name}</h4>
									<p className='chat__message-text'>{item.message}</p>
									<p className='chat__message-date'>{item.data}</p>
								</div>
							</div>
					  ))
					: 'пока нет новых сообщений'}
				<div ref={messagesEndRef} />
				<span className='chat__message-type'>
					{typingCurrentUser && `${typingCurrentUser} печатает сообщение...`}
				</span>
			</div>
			{isAuth && (
				<div className='chat__button'>
					<input
						className='chat__input'
						type='text'
						placeholder='Сообщение...'
						value={inputText}
						onChange={changeMessage}
					/>
					<div className='chat__button-send' onClick={onSubmitMessage}>
						<img src={require('../../assets/send.png')} alt='' />
					</div>
				</div>
			)}
		</div>
	)
}

export default Chat

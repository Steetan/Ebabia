import Cookies from 'js-cookie'
import React from 'react'
import { RootState } from '../../redux/store'
import { useSelector } from 'react-redux'

const Chat: React.FC<{ socket: any }> = ({ socket }) => {
	const [inputText, setInputText] = React.useState('')
	const { userImgUrl, dataUser } = useSelector((state: RootState) => state.authSlice)
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
								<img
									src={`${process.env.REACT_APP_SERVER_URL}/uploads/userIcons/${item.sender_img}`}
									alt=''
									className='chat__message-img'
								/>
								<div>
									<h4 className='chat__message-title'>{item.sender_name}</h4>
									<p className='chat__message-text'>{item.message}</p>
								</div>
							</div>
					  ))
					: 'пока нет новых сообщений'}
				<div ref={messagesEndRef} />
				<span className='chat__message-type'>
					{typingCurrentUser && `${typingCurrentUser} печатает сообщение...`}
				</span>
			</div>
			<div className='chat__button'>
				<input
					className='chat__input'
					type='text'
					placeholder='Сообщение'
					value={inputText}
					onChange={changeMessage}
				/>
				<div className='chat__button-send' onClick={onSubmitMessage}>
					<img src={require('../../assets/send.png')} alt='' />
				</div>
			</div>
		</div>
	)
}

export default Chat

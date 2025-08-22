import { translateOneDate } from './utils/translateOneDate.js'
import express from 'express'
import cors from 'cors'
import { Server } from '../node_modules/socket.io/dist/index.js'
import http from 'http'
import { v4 as uuid } from 'uuid'
import { pool } from './db.js'
import { QueryResult } from 'pg'
import jwt from 'jsonwebtoken'
import { getDate } from './utils/getDate.js'

const PORT = 6060

const app = express()

const server = http.createServer(app)
app.use(cors({ origin: '*' }))

interface ServerToClientEvents {
	noArg: () => void
	basicEmit: (a: number, b: string, c: Buffer) => void
	withAck: (d: string, callback: (e: number) => void) => void
	getRoomMessages: (data: {
		sender_id: string
		message: string
		room: string
		data: Date
		message_id: any
		isReading: boolean
	}) => void
	disconnect: (data: any) => void
	getMessages: (data: any) => void
	newMessage: (data: any) => void
	userTyping: (data: any) => void
}

interface ClientToServerEvents {
	hello: () => void
	pushMessage: (data: any) => void
	pushConnect: (data: any) => void
	typing: (data: any) => void
}

interface InterServerEvents {
	ping: () => void
}

interface SocketData {
	name: string
	age: number
}

const socketIO = new Server<
	ClientToServerEvents,
	ServerToClientEvents,
	InterServerEvents,
	SocketData
>(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
} as any)

socketIO.on('connection', (socket) => {
	socket.on('pushConnect', (data: any) => {
		const token = (data || '').replace(/Bearer\s?/, '')
		jwt.verify(token, `@dkflbckfd2003`, (err: jwt.VerifyErrors | null, decoded: any) => {
			pool.query(
				'SELECT messages.id, messages.user_id, users.name, users.fname, users.icon_url, messages.message, messages.data FROM messages LEFT JOIN users ON messages.user_id = users.id ORDER BY messages.data ASC',
				(error: Error, results: QueryResult) => {
					let newArr: any = []
					results.rows.forEach((item: any) => {
						newArr.push({
							message_id: item.id,
							sender_id: item.user_id,
							sender_name: item.name,
							sender_fname: item.fname,
							sender_img: item.icon_url,
							message: item.message,
							data: translateOneDate(item.data),
							isCurrentUser: decoded && decoded.id === item.user_id ? true : false,
						})
					})
					socket.emit('getMessages', newArr)
				},
			)
		})
	})

	socket.on(
		'pushMessage',
		(data: {
			token: string
			message: string
			sender_name: string
			sender_fname: string
			sender_img: string
			data: any
		}) => {
			const token = (data.token || '').replace(/Bearer\s?/, '')
			jwt.verify(token, `@dkflbckfd2003`, (err: jwt.VerifyErrors | null, decoded: any) => {
				if (decoded.id) {
					const messageId = uuid()
					pool.query(
						'INSERT INTO messages (id, message, user_id, data) VALUES ($1, $2, $3, $4)',
						[messageId, data.message, decoded.id, getDate()],
						(error: Error, results: QueryResult) => {
							const newObj = {
								message_id: messageId,
								message: data.message,
								sender_id: decoded.id,
								sender_name: data.sender_name,
								sender_fname: data.sender_fname,
								sender_img: data.sender_img,
								data: getDate(),
							}
							socketIO.emit('newMessage', newObj)
						},
					)
				}
			})
		},
	)

	socket.on('typing', (data: any) => {
		socketIO.emit('userTyping', data)
	})
})

server.listen(PORT, () => {
	console.log(`Server working`)
})

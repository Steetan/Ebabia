import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { QueryResult } from 'pg'
import { pool } from '../db.js'
import { v4 as uuidv4 } from 'uuid'

export const getComments = (req: Request, res: Response) => {
	try {
		pool.query(
			'SELECT comments.id, comments.description, users.name, users.fname, users.icon_url FROM comments LEFT JOIN users ON comments.user_id = users.id WHERE comments.video_id = $1',
			[req.query.look],
			(error: Error, results: QueryResult) => {
				if (error) throw error
				res.status(200).json(results.rows)
			},
		)
	} catch (error) {
		console.log(error)
	}
}

export const addComment = (req: Request, res: Response) => {
	try {
		const token = (req.body.headers.Authorization || '').replace(/Bearer\s?/, '')

		jwt.verify(token, `${process.env.JWT_SECRET}`, (err: jwt.VerifyErrors | null, decoded: any) => {
			if (err) {
				res.json({ error: 'Неверный токен' })
			} else {
				pool.query(
					'INSERT INTO comments (id, description, user_id, video_id) VALUES ($1, $2,$3, $4)',
					[uuidv4(), req.body.description, decoded.id, req.body.videoid],
					(error: Error, results: QueryResult) => {
						if (error) throw error
						res.status(201).json({
							message: 'ok',
						})
					},
				)
			}
		})
	} catch (error) {
		console.log(error)
	}
}

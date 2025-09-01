import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { QueryResult } from 'pg'
import { pool } from '../db.js'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import { getDate } from '../utils/getDate.js'

export const getPreviews = (req: Request, res: Response) => {
	try {
		pool.query('SELECT * FROM videos', (error: Error, results: QueryResult) => {
			if (error) throw error
			res.status(200).json(results.rows)
		})
	} catch (error) {
		console.log(error)
	}
}

export const getAllVideoLikes = (req: Request, res: Response) => {
	try {
		const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

		jwt.verify(token, `${process.env.JWT_SECRET}`, (err: jwt.VerifyErrors | null, decoded: any) => {
			if (err) {
				res.json({ error: 'Неверный токен' })
			} else {
				pool.query(
					'SELECT * FROM videos_likes WHERE video_id = $1',
					[req.query.id],
					(error: Error, results: QueryResult) => {
						if (error) throw error

						let likes = 0
						let disLikes = 0
						let userLike = null
						results.rows.length &&
							results.rows.forEach((item: any) => {
								if (item.user_id == decoded.id) {
									userLike = item.is_like
								}

								item.is_like && likes++
								!item.is_like && disLikes++
							})
						res.status(200).json({ likes, disLikes, userLike })
					},
				)
			}
		})
	} catch (error) {
		console.log(error)
	}
}

export const getVideoById = (req: Request, res: Response) => {
	try {
		pool.query(
			'SELECT * FROM videos WHERE videos.id = $1',
			[req.query.look],
			(error: Error, results: QueryResult) => {
				if (error) throw error
				res.status(200).json(results.rows[0])
			},
		)
	} catch (error) {
		console.log(error)
	}
}

export const getVideoBySearch = (req: Request, res: Response) => {
	try {
		pool.query(
			"SELECT * FROM videos WHERE title LIKE '%' || $1 || '%'",
			[req.query.search],
			(error: Error, results: QueryResult) => {
				if (error) throw error
				res.status(200).json(results.rows)
			},
		)
	} catch (error) {
		console.log(error)
	}
}

export const addVideo = (req: Request, res: Response) => {
	try {
		pool.query(
			'INSERT INTO videos (id, link, title, preview, description, data) VALUES ($1, $2,$3, $4, $5, $6)',
			[
				uuidv4(),
				req.file?.filename,
				req.body.title,
				req.body.imageUrl,
				req.body.description,
				getDate(),
			],
			(error: Error, results: QueryResult) => {
				if (error) throw error
				res.status(201).json({
					message: 'ok',
				})
			},
		)
	} catch (error) {
		console.log(error)
	}
}

export const addVideoLike = (req: Request, res: Response) => {
	try {
		const token = (req.body.headers.Authorization || '').replace(/Bearer\s?/, '')

		jwt.verify(token, `${process.env.JWT_SECRET}`, (err: jwt.VerifyErrors | null, decoded: any) => {
			if (err) {
				res.json({ error: 'Неверный токен' })
			} else {
				pool.query(
					'INSERT INTO videos_likes (id, video_id, user_id, is_like) VALUES ($1, $2, $3, $4)',
					[uuidv4(), req.query.id, decoded.id, req.query.rating],
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

export const deleteVideoById = (req: Request, res: Response) => {
	try {
		const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
		const filePath = `uploads/previews/${req.query.prevname}`
		const filePath2 = `uploads/videos/${req.query.videoname}`
		jwt.verify(token, `${process.env.JWT_SECRET}`, (err: jwt.VerifyErrors | null, decoded: any) => {
			if (err) {
				res.json({ error: 'Неверный токен' })
			} else {
				req.query.prevname &&
					fs.stat(filePath, (err, stats) => {
						fs.unlink(filePath, (err) => {
							if (err) {
								console.error(err)
							}
						})
					})
				req.query.videoname &&
					fs.stat(filePath2, (err, stats) => {
						fs.unlink(filePath2, (err) => {
							if (err) {
								console.error(err)
							}
						})
					})

				pool.query(
					'DELETE FROM videos WHERE id = $1',
					[req.query.id],
					(error: Error, results: QueryResult) => {
						if (error) throw error
						pool.query(
							'DELETE FROM comments WHERE video_id = $1',
							[req.query.id],
							(error: Error, results: QueryResult) => {
								if (error) throw error
								res.status(201).json({
									message: 'ok',
								})
							},
						)
					},
				)
			}
		})
	} catch (error) {
		console.log(error)
	}
}

export const deleteVideoLike = (req: Request, res: Response) => {
	try {
		const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

		jwt.verify(token, `${process.env.JWT_SECRET}`, (err: jwt.VerifyErrors | null, decoded: any) => {
			if (err) {
				res.json({ error: 'Неверный токен' })
			} else {
				pool.query(
					'DELETE FROM videos_likes WHERE video_id = $1 AND user_id = $2',
					[req.query.id, decoded.id],
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

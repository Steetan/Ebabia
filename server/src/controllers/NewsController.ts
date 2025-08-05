import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { QueryResult } from 'pg'
import { pool } from '../db.js'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'

export const getAllNews = (req: Request, res: Response) => {
	try {
		pool.query('SELECT * FROM news', (error: Error, results: QueryResult) => {
			if (error) throw error
			res.status(200).json(results.rows)
		})
	} catch (error) {
		console.log(error)
	}
}

export const addNews = (req: Request, res: Response) => {
	try {
		const token = (req.body.headers.Authorization || '').replace(/Bearer\s?/, '')

		jwt.verify(token, `${process.env.JWT_SECRET}`, (err: jwt.VerifyErrors | null, decoded: any) => {
			if (err) {
				res.json({ error: 'Неверный токен' })
			} else {
				pool.query(
					'INSERT INTO news (id, description, img_link) VALUES ($1, $2,$3)',
					[uuidv4(), req.body.description, req.body.imgUrl],
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

export const deleteNewsById = (req: Request, res: Response) => {
	try {
		const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
		const filePath = `uploads/news/${req.query.prevname}`
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

				pool.query(
					'DELETE FROM news WHERE id = $1',
					[req.query.id],
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

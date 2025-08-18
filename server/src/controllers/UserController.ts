import jwt from 'jsonwebtoken'
import { QueryResult } from 'pg'
import { pool } from '../db.js'
import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { validationResult } from '../../node_modules/express-validator/lib/validation-result.js'
import { generateJWT } from '../utils/generateJWT.js'
import bcrypt from 'bcrypt'
import fs from 'fs'

export const getMeInfo = (req: Request, res: Response) => {
	try {
		const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

		jwt.verify(token, `${process.env.JWT_SECRET}`, (err: jwt.VerifyErrors | null, decoded: any) => {
			if (err) {
				res.json({ error: 'Неверный токен' })
			} else {
				pool.query(
					'SELECT * FROM users WHERE id = $1',
					[decoded.id],
					(error: Error, results: QueryResult) => {
						if (error) throw error
						res.json(results.rows[0])
					},
				)
			}
		})
	} catch (error) {
		res.status(403).json({
			message: 'Нет доступа',
		})
	}
}

export const loginUser = (req: Request, res: Response) => {
	try {
		pool.query(
			'SELECT * FROM users WHERE email = $1',
			[req.query.email],
			async (error: Error, results: QueryResult) => {
				if (error) throw error

				// Проверяем, существует ли пользователь
				if (results.rows.length === 0) {
					return res.json({
						message: 'Неверный логин или пароль',
					})
				}

				const user = results.rows[0]

				// Сравниваем пароли
				const isValidPass = await bcrypt.compare(String(req.query.password), user.password)

				if (!isValidPass) {
					return res.json({
						access: false,
						message: 'Неверный логин или пароль',
					})
				}

				// Если пароль верный, возвращаем данные пользователя
				res.status(200).json({
					access: true,
					name: user.name,
					fname: user.fname,
					email: user.email,
					isAdmin: user.is_admin,
					token: generateJWT({
						id: user.id,
						name: user.name,
						email: req.query.email,
						// Не нужно передавать пароль в JWT
					}),
					iconUrl: user.icon_url,
				})
			},
		)
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Ошибка сервера' })
	}
}

export const deleteUser = (req: Request, res: Response) => {
	try {
		const filePath = `uploads/userIcons/${req.body.url}`
		const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
		jwt.verify(token, `${process.env.JWT_SECRET}`, (err: jwt.VerifyErrors | null, decoded: any) => {
			if (err) {
				res.json({ error: 'Неверный токен' })
			} else {
				pool.query(
					`DELETE FROM users WHERE id = $1`,
					[decoded.id],
					(error: Error, results: QueryResult) => {
						if (error) throw error
						fs.stat(filePath, (err, stats) => {
							fs.unlink(filePath, (err) => {
								if (err) {
									console.error(err)
									return res.status(500).json({ message: 'Error deleting file' })
								}
								return res.json({ message: 'File deleted successfully' })
							})
						})
						res.status(200).json({
							message: 'Пользователь был удален',
						})
					},
				)
			}
		})
	} catch (error) {
		console.log(error)
	}
}

export const createUser = async (req: Request, res: Response) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(403).json({ error: errors.array() })
	}

	const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [req.body.email])
	if (existingUser.rows.length > 0) {
		return res
			.status(400)
			.json({ success: false, message: 'Пользователь с таким именем уже существует' })
	}

	const userId = uuidv4()

	const password = req.body.password
	const salt = await bcrypt.genSalt(10)
	const passwordHash = await bcrypt.hash(password, salt)

	try {
		pool.query(
			'INSERT INTO users (id, name, fname, password, email, icon_url) VALUES ($1, $2, $3, $4, $5, $6)',
			[userId, req.body.name, req.body.fname, passwordHash, req.body.email, req.body.imgUrl],
			(error: Error, results: QueryResult) => {
				if (error) throw error

				res.status(201).json({
					token: generateJWT({
						id: userId,
						name: req.body.name,
						email: req.query.email,
						password: req.query.password,
					}),
					name: req.body.name,
					fname: req.body.fname,
					email: req.body.email,
				})
			},
		)
	} catch (error) {
		console.log(error)
	}
}

export const updateUser = async (req: Request, res: Response) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(403).json({ error: errors.array() })
		}

		const token = (req.body.headers.Authorization || '').replace(/Bearer\s?/, '')

		jwt.verify(token, `${process.env.JWT_SECRET}`, (err: jwt.VerifyErrors | null, decoded: any) => {
			if (err) {
				res.status(401).json({ error: 'Неверный токен' })
			} else {
				pool.query(
					'UPDATE users SET name = $1, fname = $2, email = $3 WHERE id = $4',
					[req.body.name, req.body.fname, req.body.email, decoded.id],
					(error: Error, results: QueryResult) => {
						if (error) throw error

						const token = jwt.sign(
							{
								id: decoded.id,
								email: req.body.email,
							},
							`${process.env.JWT_SECRET}`,
							{
								expiresIn: '30d',
							},
						)
						res.status(200).json({ message: 'Данные были обновлены успешно!', token })
					},
				)
			}
		})
	} catch (error) {
		res.status(403).json({
			message: 'Нет доступа',
		})
	}
}

export const updateUserImg = async (req: Request, res: Response) => {
	try {
		const token = (req.body.headers.Authorization || '').replace(/Bearer\s?/, '')

		jwt.verify(token, `${process.env.JWT_SECRET}`, (err: jwt.VerifyErrors | null, decoded: any) => {
			if (err) {
				res.status(401).json({ error: 'Неверный токен' })
			} else {
				pool.query(
					'UPDATE users SET icon_url = $1 WHERE id = $2',
					[req.body.img, decoded.id],
					(error: Error, results: QueryResult) => {
						if (error) throw error
						res.status(200).json({ message: 'Аватарка обновилась!' })
					},
				)
			}
		})
	} catch (error) {
		res.status(403).json({
			message: 'Нет доступа',
		})
	}
}

export const updatePasswordUser = async (req: Request, res: Response) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(403).json({ error: errors.array() })
		}

		const token = (req.body.headers.Authorization || '').replace(/Bearer\s?/, '')

		const password = req.body.password
		const salt = await bcrypt.genSalt(10)
		const passwordHash = await bcrypt.hash(password, salt)

		jwt.verify(token, `${process.env.JWT_SECRET}`, (err: jwt.VerifyErrors | null, decoded: any) => {
			if (err) {
				res.status(401).json({ error: 'Неверный токен' })
			} else {
				pool.query(
					'UPDATE users SET password = $1 WHERE id=$2',
					[passwordHash, decoded.id],
					(error: Error, results: QueryResult) => {
						if (error) throw error
						res.status(200).json({ message: 'Пароль был успешно обновлен!' })
					},
				)
			}
		})
	} catch (error) {
		res.status(403).json({
			message: 'Нет доступа',
		})
	}
}

export const deleteUserImg = (req: Request, res: Response) => {
	try {
		const filePath = `uploads/userIcons/${req.params.filename}`

		console.log(req.params.filename)

		const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

		jwt.verify(token, `${process.env.JWT_SECRET}`, (err: jwt.VerifyErrors | null, decoded: any) => {
			if (err) {
				res.status(401).json({ error: 'Неверный токен' })
			} else {
				pool.query(
					`UPDATE users SET icon_url = '' WHERE id = $1`,
					[decoded.id],
					(error: Error, results: QueryResult) => {
						if (error) throw error
						fs.unlink(filePath, (err) => {
							if (err) {
								return res.status(500).json({ error: 'Ошибка при удалении файла' })
							}
							res.json({ message: 'Файл успешно удален' })
						})
					},
				)
			}
		})
	} catch (error) {
		res.status(403).json({
			message: 'Нет доступа',
		})
	}
}

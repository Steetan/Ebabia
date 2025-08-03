import { NextFunction, Request, Response } from 'express'

export default (req: Request, res: Response, next: NextFunction) => {
	const token = String(req.query.token) || ''
	if (token) {
		next()
	} else {
		res.status(403).json({
			message: 'Нет доступа',
		})
	}
}

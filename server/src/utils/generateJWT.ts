import jwt from 'jsonwebtoken'

export const generateJWT = (data: {}) => {
	const token = jwt.sign(data, `${process.env.JWT_SECRET}`, {
		expiresIn: '20d',
	})

	return token
}

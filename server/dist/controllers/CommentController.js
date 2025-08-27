import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { getDate } from '../utils/getDate.js';
export const getComments = (req, res) => {
    try {
        pool.query('SELECT comments.id, comments.description, users.name, users.fname, users.icon_url, comments.data FROM comments LEFT JOIN users ON comments.user_id = users.id WHERE comments.video_id = $1', [req.query.look], (error, results) => {
            if (error)
                throw error;
            res.status(200).json(results.rows);
        });
    }
    catch (error) {
        console.log(error);
    }
};
export const addComment = (req, res) => {
    try {
        const token = (req.body.headers.Authorization || '').replace(/Bearer\s?/, '');
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
            if (err) {
                res.json({ error: 'Неверный токен' });
            }
            else {
                pool.query('INSERT INTO comments (id, description, user_id, video_id, data) VALUES ($1, $2,$3, $4, $5)', [uuidv4(), req.body.description, decoded.id, req.body.videoid, getDate()], (error, results) => {
                    if (error)
                        throw error;
                    res.status(201).json({
                        message: 'ok',
                    });
                });
            }
        });
    }
    catch (error) {
        console.log(error);
    }
};

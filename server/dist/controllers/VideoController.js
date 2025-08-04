import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
export const getPreviews = (req, res) => {
    try {
        pool.query('SELECT * FROM videos', (error, results) => {
            if (error)
                throw error;
            res.status(200).json(results.rows);
        });
    }
    catch (error) {
        console.log(error);
    }
};
export const getVideoById = (req, res) => {
    try {
        pool.query('SELECT * FROM videos WHERE videos.id = $1', [req.query.look], (error, results) => {
            if (error)
                throw error;
            res.status(200).json(results.rows[0]);
        });
    }
    catch (error) {
        console.log(error);
    }
};
export const getVideoBySearch = (req, res) => {
    try {
        pool.query("SELECT * FROM videos WHERE title LIKE '%' || $1 || '%'", [req.query.search], (error, results) => {
            if (error)
                throw error;
            res.status(200).json(results.rows);
        });
    }
    catch (error) {
        console.log(error);
    }
};
export const addVideo = (req, res) => {
    try {
        const token = (req.body.headers.Authorization || '').replace(/Bearer\s?/, '');
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
            var _a;
            if (err) {
                res.json({ error: 'Неверный токен' });
            }
            else {
                pool.query('INSERT INTO videos (id, link, title, preview, description) VALUES ($1, $2,$3, $4, $5)', [
                    uuidv4(),
                    (_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname,
                    req.body.title,
                    req.body.imageUrl,
                    req.body.description,
                ], (error, results) => {
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

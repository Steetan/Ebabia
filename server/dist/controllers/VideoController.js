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
        pool.query('SELECT videos.*, users.* FROM videos JOIN users ON videos.user_id = users.id WHERE videos.id = $1', [req.query.look], (error, results) => {
            if (error)
                throw error;
            res.status(200).json(results.rows[0]);
        });
    }
    catch (error) {
        console.log(error);
    }
};
export const getVideoByUserId = (req, res) => {
    try {
        const token = String(req.query.token) || '';
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
            if (err) {
                res.json({ error: 'Неверный токен' });
            }
            else {
                pool.query('SELECT * FROM videos WHERE user_id = $1', [decoded.id], (error, results) => {
                    if (error)
                        throw error;
                    res.status(200).json(results.rows);
                });
            }
        });
    }
    catch (error) {
        console.log(error);
    }
};
export const deleteUserVideo = (req, res) => {
    try {
        const token = String(req.query.token) || '';
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
            if (err) {
                res.json({ error: 'Неверный токен' });
            }
            else {
                pool.query('DELETE FROM videos WHERE id = $1', [req.query.id], (error, results) => {
                    if (error)
                        throw error;
                    pool.query('SELECT * FROM videos WHERE user_id = $1', [decoded.id], (error, results) => {
                        if (error)
                            throw error;
                        res.status(200).json(results.rows);
                    });
                });
            }
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
        const token = String(req.query.token) || '';
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
            var _a;
            if (err) {
                res.json({ error: 'Неверный токен' });
            }
            else {
                pool.query('INSERT INTO videos (id, link, title, preview, category, description, user_id) VALUES ($1, $2,$3, $4, $5, $6, $7)', [
                    uuidv4(),
                    (_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname,
                    req.body.title,
                    req.body.imageUrl,
                    req.body.category,
                    req.body.description,
                    decoded.id,
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

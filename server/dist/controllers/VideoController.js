import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
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
    var _a;
    try {
        pool.query('INSERT INTO videos (id, link, title, preview, description, data) VALUES ($1, $2,$3, $4, $5, $6)', [
            uuidv4(),
            (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename,
            req.body.title,
            req.body.imageUrl,
            req.body.description,
            req.body.data,
        ], (error, results) => {
            if (error)
                throw error;
            res.status(201).json({
                message: 'ok',
            });
        });
    }
    catch (error) {
        console.log(error);
    }
};
export const deleteVideoById = (req, res) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        const filePath = `uploads/previews/${req.query.prevname}`;
        const filePath2 = `uploads/videos/${req.query.videoname}`;
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
            if (err) {
                res.json({ error: 'Неверный токен' });
            }
            else {
                req.query.prevname &&
                    fs.stat(filePath, (err, stats) => {
                        fs.unlink(filePath, (err) => {
                            if (err) {
                                console.error(err);
                            }
                        });
                    });
                req.query.videoname &&
                    fs.stat(filePath2, (err, stats) => {
                        fs.unlink(filePath2, (err) => {
                            if (err) {
                                console.error(err);
                            }
                        });
                    });
                pool.query('DELETE FROM videos WHERE id = $1', [req.query.id], (error, results) => {
                    if (error)
                        throw error;
                    pool.query('DELETE FROM comments WHERE video_id = $1', [req.query.id], (error, results) => {
                        if (error)
                            throw error;
                        res.status(201).json({
                            message: 'ok',
                        });
                    });
                });
            }
        });
    }
    catch (error) {
        console.log(error);
    }
};

import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { getDate } from '../utils/getDate.js';
export const getAllNews = (req, res) => {
    try {
        pool.query('SELECT * FROM news', (error, results) => {
            if (error)
                throw error;
            res.status(200).json(results.rows);
        });
    }
    catch (error) {
        console.log(error);
    }
};
export const getAllNewsLikes = (req, res) => {
    try {
        pool.query('SELECT * FROM news_likes', (error, results) => {
            if (error)
                throw error;
            res.status(200).json(results.rows);
        });
    }
    catch (error) {
        console.log(error);
    }
};
export const addNews = (req, res) => {
    try {
        const token = (req.body.headers.Authorization || '').replace(/Bearer\s?/, '');
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
            if (err) {
                res.json({ error: 'Неверный токен' });
            }
            else {
                pool.query('INSERT INTO news (id, description, img_link, data) VALUES ($1, $2, $3, $4)', [uuidv4(), req.body.description, req.body.imgUrl, getDate()], (error, results) => {
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
export const addNewsLike = (req, res) => {
    try {
        const token = (req.body.headers.Authorization || '').replace(/Bearer\s?/, '');
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
            if (err) {
                res.json({ error: 'Неверный токен' });
            }
            else {
                pool.query('INSERT INTO news_likes (id, news_id, user_id) VALUES ($1, $2, $3)', [uuidv4(), req.query.id, decoded.id], (error, results) => {
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
export const deleteNewsById = (req, res) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        const filePath = `uploads/news/${req.query.prevname}`;
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
                pool.query('DELETE FROM news WHERE id = $1', [req.query.id], (error, results) => {
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
export const deleteNewsLike = (req, res) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
            if (err) {
                res.json({ error: 'Неверный токен' });
            }
            else {
                pool.query('DELETE FROM news_likes WHERE news_id = $1 AND user_id = $2', [req.query.id, decoded.id], (error, results) => {
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

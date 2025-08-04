import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
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
export const addNews = (req, res) => {
    try {
        const token = (req.body.headers.Authorization || '').replace(/Bearer\s?/, '');
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
            if (err) {
                res.json({ error: 'Неверный токен' });
            }
            else {
                pool.query('INSERT INTO news (id, description, img_link) VALUES ($1, $2,$3)', [uuidv4(), req.body.description, req.body.imgUrl], (error, results) => {
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

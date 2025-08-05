import express, { json } from 'express';
import cors from 'cors';
import { Server } from '../node_modules/socket.io/dist/index.js';
import http from 'http';
import { v4 as uuid } from 'uuid';
import { pool } from './db.js';
import jwt from 'jsonwebtoken';
import { getDate } from '../utils/getDate.js';
const PORT = 8080;
const app = express();
app.use(cors({ origin: '*' }));
app.use(json());
const server = http.createServer(app);
const socketIO = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
app.post('/auth/login', (req, res) => {
    try {
        pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [req.query.valEmail, req.query.valPassword], (error, results) => {
            if (error)
                throw error;
            if (results.rows.length) {
                const token = jwt.sign({
                    id: results.rows[0].id,
                    email: req.body.email,
                }, `secret123`, {
                    expiresIn: '30d',
                });
                res.status(200).json({
                    token,
                    access: true,
                });
            }
            else if (!results.rows.length) {
                res.status(200).json({
                    access: false,
                });
            }
        });
    }
    catch (error) {
        console.log(error);
    }
});
app.get('/users', (req, res) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        jwt.verify(token, `secret123`, (err, decoded) => {
            if (err) {
                res.json({ error: 'Неверный токен' });
            }
            else {
                pool.query(`SELECT * FROM users WHERE ${req.query.search
                    ? `id <> $1 AND (user_name LIKE '%${req.query.search}%' OR user_fname LIKE '%${req.query.search}%' OR user_oname LIKE '%${req.query.search}%')`
                    : `id <> $1`}`, [decoded.id], (error, results) => {
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
});
app.post('/crmessage', (req, res) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    jwt.verify(token, `secret123`, (err, decoded) => {
        if (err) {
            res.json({ error: 'Неверный токен' });
        }
        else {
            pool.query('SELECT room_id FROM room_users WHERE user_id = $1 OR user_id = $2 GROUP BY room_id HAVING COUNT(DISTINCT user_id) = 2', [decoded.id, req.body.id], (error, resultsRoom) => {
                const id = uuid();
                console.log(resultsRoom.rows);
                if (resultsRoom.rows.length) {
                    pool.query('SELECT * FROM messages WHERE room_id = $1', [id], (error, results) => {
                        console.log(id);
                        res.status(200).json({
                            id: resultsRoom.rows[0].room_id,
                            messages: results.rows,
                        });
                    });
                }
                else {
                    pool.query('INSERT INTO rooms (id, room_type) VALUES($1, $2)', [id, 'two'], (error, results) => {
                        if (error)
                            throw error;
                        pool.query('INSERT INTO room_users (id, room_id, user_id) VALUES($1, $2, $3)', [uuid(), id, decoded.id], (error, results) => {
                            if (error)
                                throw error;
                            pool.query('INSERT INTO room_users (id, room_id, user_id) VALUES($1, $2, $3)', [uuid(), id, req.body.id], (error, results) => {
                                if (error)
                                    throw error;
                                res.status(200).json({ id });
                            });
                        });
                    });
                }
            });
        }
    });
});
app.get('/meinfo', (req, res) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        jwt.verify(token, `secret123`, (err, decoded) => {
            if (err) {
                res.json({ error: 'Неверный токен' });
            }
            else {
                pool.query('SELECT * FROM users WHERE id = $1', [decoded.id], (error, results) => {
                    if (error)
                        throw error;
                    res.status(200).json(results.rows[0]);
                });
            }
        });
    }
    catch (error) {
        console.log(error);
    }
});
app.get('/senderinfo', (req, res) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        jwt.verify(token, 'secret123', (err, decoded) => {
            if (err) {
                res.json({ error: 'Неверный токен' });
            }
            else {
                if (req.query.roomid !== 'undefined') {
                    pool.query('SELECT * FROM room_users WHERE room_id = $1 AND user_id <> $2', [req.query.roomid, decoded.id], (error, results) => {
                        if (error)
                            throw error;
                        if (results.rows.length > 0) {
                            pool.query('SELECT * FROM users WHERE id = $1', [results.rows[0].user_id], (error, resultsUser) => {
                                res.status(200).json(resultsUser.rows[0]);
                            });
                        }
                        else {
                            res.status(200).json({});
                        }
                    });
                }
                else {
                    res.status(200).json({});
                }
            }
        });
    }
    catch (error) {
        console.log(error);
    }
});
app.post('/auth/reg', (req, res) => {
    try {
        if (req.body.valName &&
            req.body.valFname &&
            req.body.valOname &&
            req.body.valEmail &&
            req.body.valPassword) {
            pool.query('SELECT * FROM users WHERE email = $1', [req.body.valEmail], (error, results) => {
                if (error)
                    throw error;
                const id = uuid();
                if (!results.rows.length) {
                    pool.query('INSERT INTO users (id, user_name, user_fname, user_oname, email, password) VALUES ($1, $2, $3, $4, $5, $6)', [
                        id,
                        req.body.valName,
                        req.body.valFname,
                        req.body.valOname,
                        req.body.valEmail,
                        req.body.valPassword,
                    ], (error, results) => {
                        if (error)
                            throw error;
                        const token = jwt.sign({
                            id,
                            email: req.body.email,
                        }, `secret123`, {
                            expiresIn: '30d',
                        });
                        res.status(200).json({
                            message: 'Пользователь успешно создан',
                            access: true,
                            token,
                        });
                    });
                }
                else {
                    res.json({
                        access: false,
                    });
                }
            });
        }
        else {
            res.json({
                access: false,
            });
        }
    }
    catch (error) {
        res.status(400).json({
            access: false,
        });
    }
});
const connectedUsers = {};
socketIO.on('connection', (socket) => {
    console.log(`${socket.id} connected`);
    socket.on('userConnect', (data) => {
        connectedUsers[socket.id] = data.userId;
        socketIO.emit('userConnected', { userId: data.userId });
        socket.emit('allConnectedUsers', Object.values(connectedUsers));
    });
    socket.on('userDisconnect', (data) => {
        const lastDate = 123;
        console.log('lastDate', lastDate);
        delete connectedUsers[socket.id];
        pool.query('UPDATE users SET last_visit = $1 WHERE id = $2', [lastDate, data.userId]);
        socketIO.emit('userDisconnected', { userId: data.userId, lastDate });
    });
    socket.on('pushConn', (data) => {
        const token = (data.user_id || '').replace(/Bearer\s?/, '');
        jwt.verify(token, `secret123`, (err, decoded) => {
            if (decoded.id) {
                pool.query('SELECT * FROM messages WHERE room_id = $1', [data.room], (error, results) => {
                    let newArr = [];
                    results.rows &&
                        results.rows.forEach((item) => {
                            newArr.push({
                                sender_id: item.user_id,
                                message: item.message,
                                room: data.room,
                                data: item.data,
                            });
                        });
                    socket.emit('conn', newArr);
                });
            }
        });
    });
    socket.on('load', (data) => {
        const token = data ? (data || '').replace(/Bearer\s?/, '') : '';
        jwt.verify(token, `secret123`, (err, decoded) => {
            if (decoded.id) {
                pool.query('SELECT room_id FROM room_users WHERE user_id = $1', [decoded.id], (error, results) => {
                    if (error)
                        throw error;
                    let newArr = [];
                    results.rows &&
                        results.rows.forEach((item) => {
                            newArr.push(item.room_id);
                        });
                    pool.query(`SELECT room_users.id, room_users.room_id, room_users.user_id, users.* FROM room_users JOIN users ON room_users.user_id = users.id WHERE room_users.room_id IN (${newArr
                        .map((item) => `'${item}'`)
                        .join(',')}) AND user_id <> '${decoded.id}'`, (error, resultsRooms) => {
                        socket.emit('loadMessages', resultsRooms.rows);
                    });
                });
            }
        });
    });
    socket.on('typing', (data) => {
        socketIO.emit('userTyping', data);
    });
    socket.on('pushRoomMessage', (data) => {
        try {
            const token = (data.user_id || '').replace(/Bearer\s?/, '');
            jwt.verify(token, `secret123`, (err, decoded) => {
                if (decoded.id) {
                    pool.query('INSERT INTO messages (room_id, user_id, message, data) VALUES($1, $2, $3, $4)', [data.room, decoded.id, data.message, data.data]);
                }
                socketIO.emit('getRoomMessages', {
                    sender_id: decoded.id,
                    message: data.message,
                    room: data.room,
                    data: data.data,
                });
            });
        }
        catch (error) {
            console.log(error);
        }
    });
    socket.on('disconnect', () => {
        const lastDate = getDate();
        console.log(123);
        console.log(`${socket.id} disconnected`);
        const userId = connectedUsers[socket.id];
        pool.query('UPDATE users SET last_visit = $1 WHERE id = $2', [lastDate, userId]);
        if (userId) {
            socketIO.emit('userDisconnected', { userId, lastDate: lastDate });
        }
        delete connectedUsers[socket.id];
    });
});
server.listen(PORT, () => {
    console.log(`Server working`);
});

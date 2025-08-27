import { Router } from 'express';
import { addVideo, deleteVideoById, getPreviews, getVideoById, getVideoBySearch, } from './controllers/VideoController.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createUser, deleteUser, deleteUserImg, getMeInfo, loginUser, updatePasswordUser, updateUser, updateUserImg, } from './controllers/UserController.js';
import { registerValidator, updatePasswordValidator, updateValidator, } from './middlewares/validations.js';
import checkAuth from './utils/checkAuth.js';
import { addNews, addNewsLike, deleteNewsById, deleteNewsLike, getAllNews, getAllNewsLikes, } from './controllers/NewsController.js';
import { addComment, getComments } from './controllers/CommentController.js';
import { v4 as uuidv4 } from 'uuid';
const router = Router();
const storageVideos = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads/videos');
    },
    filename: (_, file, cb) => {
        const ext = path.extname(file.originalname); // Получите расширение файла
        cb(null, `${uuidv4()}${ext}`); // Используйте UUID и добавьте расширение
    },
});
const storagePreviews = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads/previews');
    },
    filename: (_, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
    },
});
const storageNewsPreviews = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads/news');
    },
    filename: (_, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
    },
});
const storageUserIcons = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads/userIcons');
    },
    filename: (_, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
    },
});
const upload = multer({ storage: storageVideos });
const uploadImage = multer({ storage: storagePreviews });
const uploadNewsImage = multer({ storage: storageNewsPreviews });
const uploadUserIcons = multer({ storage: storageUserIcons });
router.get('/news', getAllNews);
router.get('/newslikes', getAllNewsLikes);
router.get('/comments', getComments);
router.get('/prevvideo', getPreviews);
router.get('/video', getVideoById);
router.get('/quest', getVideoBySearch);
router.get('/meinfo', getMeInfo);
router.get('/auth/login', loginUser);
router.post('/news', addNews);
router.post('/newslike', addNewsLike);
router.post('/comments', addComment);
router.post('/auth/reg', registerValidator, createUser);
router.post('/addvideo', upload.single('video'), addVideo);
router.post('/prev', uploadImage.single('image'), (req, res) => {
    var _a;
    res.status(201).json({
        url: `${(_a = req.file) === null || _a === void 0 ? void 0 : _a.filename}`,
    });
});
router.post('/newsprev', uploadNewsImage.single('image'), (req, res) => {
    var _a;
    res.status(201).json({
        url: `${(_a = req.file) === null || _a === void 0 ? void 0 : _a.filename}`,
    });
});
router.post('/userimage', uploadUserIcons.single('image'), (req, res) => {
    var _a;
    res.status(201).json({
        url: `${(_a = req.file) === null || _a === void 0 ? void 0 : _a.filename}`,
    });
});
router.patch('/auth/update', checkAuth, updateValidator, updateUser);
router.patch('/auth/updimg', updateUserImg);
router.patch('/auth/updpass', checkAuth, updatePasswordValidator, updatePasswordUser);
router.delete('/news', deleteNewsById);
router.delete('/newslike', deleteNewsLike);
router.delete('/video', deleteVideoById);
router.delete('/user', deleteUser);
router.delete('/userimage/:filename', deleteUserImg);
router.delete('/prev/:filename', (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join('uploads/previews', fileName);
    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка при удалении файла' });
        }
        res.json({ message: 'Файл успешно удален' });
    });
});
router.delete('/newsprev/:filename', (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join('uploads/news', fileName);
    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка при удалении файла' });
        }
        res.json({ message: 'Файл успешно удален' });
    });
});
export default router;

import { Router } from 'express';
import { addVideo, deleteUserVideo, getPreviews, getVideoById, getVideoBySearch, getVideoByUserId, } from './controllers/VideoController.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createUser, deleteUser, deleteUserImg, getMeInfo, loginUser, updatePasswordUser, updateUser, updateUserImg, } from './controllers/UserController.js';
import { registerValidator, updatePasswordValidator, updateValidator, } from './middlewares/validations.js';
import checkAuth from './utils/checkAuth.js';
const router = Router();
const storageVideos = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads/videos');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});
const storagePreviews = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads/previews');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});
const storageUserIcons = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads/userIcons');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storageVideos });
const uploadImage = multer({ storage: storagePreviews });
const uploadUserIcons = multer({ storage: storageUserIcons });
router.get('/', getPreviews);
router.get('/video', getVideoById);
router.get('/video/user', getVideoByUserId);
router.delete('/video/user', deleteUserVideo);
router.get('/quest', getVideoBySearch);
router.get('/meinfo', getMeInfo);
router.get('/auth/login', loginUser);
router.post('/auth/reg', registerValidator, createUser);
router.post('/addvideo', upload.single('video'), addVideo);
router.post('/prev', uploadImage.single('image'), (req, res) => {
    var _a;
    res.status(201).json({
        url: `${(_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname}`,
    });
});
router.post('/userimage', uploadUserIcons.single('image'), (req, res) => {
    var _a;
    res.status(201).json({
        url: `${(_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname}`,
    });
});
router.patch('/auth/update', checkAuth, updateValidator, updateUser);
router.patch('/auth/updimg', checkAuth, updateUserImg);
router.patch('/auth/updpass', checkAuth, updatePasswordValidator, updatePasswordUser);
router.delete('/user', deleteUser);
router.delete('/upload/user/delete/:filename', deleteUserImg);
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
router.delete('/userimage/:filename', (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join('uploads/userIcons', fileName);
    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка при удалении файла' });
        }
        res.json({ message: 'Файл успешно удален' });
    });
});
export default router;

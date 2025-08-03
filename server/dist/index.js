import express from 'express';
import router from './routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();
const PORT = Number(process.env.PORT) || 8080;
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/', router);
app.listen(PORT, () => {
    console.log('server has been started on port', PORT);
});

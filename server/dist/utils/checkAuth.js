export default (req, res, next) => {
    const token = (req.body.headers.Authorization || '').replace(/Bearer\s?/, '');
    if (token) {
        next();
    }
    else {
        res.status(403).json({
            message: 'Нет доступа',
        });
    }
};

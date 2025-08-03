export default (req, res, next) => {
    const token = String(req.query.token) || '';
    if (token) {
        next();
    }
    else {
        res.status(403).json({
            message: 'Нет доступа',
        });
    }
};

const jwt = require('jsonwebtoken');

function tokenAuth(req, res, next) {
    const token = req.header('NO_W_XX');
    if (!token)
        return res.status(401).json({ success: false, message: 'No token, authorizaton denied' });
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log('token err', err.message);
        res.status(400).json({ success: false, message: 'Token is not valid' });
    }
}

module.exports = tokenAuth;
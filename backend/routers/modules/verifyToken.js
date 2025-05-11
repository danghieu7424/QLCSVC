const jwt = require("jsonwebtoken");
const { queryDatabase } = require("./mySQLConfig");
require('dotenv').config();

const SECRET_KEY = process.env.qlcsvc_SECRET_KEY;

// Middleware kiểm tra token
function verifyToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = decoded;
        next();
    });
}

async function checkManager(req, res, next) {
    const decoded = req.user;

    const [rows] = await queryDatabase(
        'SELECT Role FROM AUTH WHERE MaCanBo = ? LIMIT 1',
        [decoded.id]
    );

    if (!rows || rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (rows.Role !== 'manager') {
        return res.status(403).json({ message: 'Access denied' });
    }

    next();
}

module.exports = {
    verifyToken,
    checkManager
};

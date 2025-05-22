const express = require("express");
const favicon = require("serve-favicon");
const path = require("path");
const jwt = require("jsonwebtoken");
const { queryDatabase } = require("./modules/mySQLConfig");
const auth = require("./auth");
const api = require("./api");
const upload = require("./upload");
const stream = require("./stream");

require("dotenv").config();

const router = express.Router();
const SECRET_KEY = process.env.qlcsvc_SECRET_KEY;

router.use("/", api);
router.use("/", upload);
router.use("/", stream);
router.use("/", auth);

// Middleware kiểm tra token
function requireAuth(req, res, next) {
    const token = req.cookies.token;
    if (!token)
        return res
            .status(404)
            .sendFile(path.join(__dirname, "htdocs", "404.html"));

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.redirect("/login");
        req.user = decoded;
        next();
    });
}

async function requireAuthManager(req, res, next) {
    const decoded = req.user;

    const [rows] = await queryDatabase(
        'SELECT Role FROM AUTH WHERE MaCanBo = ? LIMIT 1',
        [decoded.id]
    );

    if (!rows || rows.length === 0 || rows.Role !== 'manager') {
        return res
            .status(404)
            .sendFile(path.join(__dirname, "htdocs", "404.html"));
    }

    next();
}


//http docs
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "htdocs", "index.html"));
});

router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "htdocs", "index.html"));
});

router.get("/profile", requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "htdocs", "index.html"));
});

router.get("/change-password", requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "htdocs", "index.html"));
});

router.get("/quan-ly-phong-page", requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "htdocs", "index.html"));
});

router.get("/loai-thiet-bi", requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "htdocs", "index.html"));
});

router.get("/thiet-bi-trong-phong", requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "htdocs", "index.html"));
});

router.get("/thiet-bi", requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "htdocs", "index.html"));
});

router.get("/van-ban", requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "htdocs", "index.html"));
});

router.use(express.static(path.join(__dirname, "htdocs")));
router.use(favicon(path.join(__dirname, "htdocs", "favicon.ico")));
router.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, "htdocs", "404.html"));
});

module.exports = router;

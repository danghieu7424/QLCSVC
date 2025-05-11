const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const AVATAR_FOLDER = path.join(__dirname, "./storages/avatars");
const PUBLIC_FOLDER = path.join(__dirname, "./storages/public");

router.get("/api/stream/avatar", (req, res) => {
    const fileName = req.query.path;
    if (!fileName) return res.status(400).send("Thiếu ?path=");

    const filePath = path.join(AVATAR_FOLDER, fileName);

    // Ngăn truy cập ngoài thư mục
    if (!filePath.startsWith(AVATAR_FOLDER)) {
        return res.status(403).send("Truy cập không hợp lệ");
    }

    // Kiểm tra file tồn tại
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            return res.status(404).send("Không tìm thấy ảnh");
        }

        // Xác định MIME
        const ext = path.extname(filePath).toLowerCase();
        const mime = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".gif": "image/gif",
            ".webp": "image/webp",
        }[ext] || "application/octet-stream";

        // Set header và stream
        res.setHeader("Content-Type", mime);
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

router.get("/api/stream/public", (req, res) => {
    const fileName = req.query.path;
    if (!fileName) return res.status(400).send("Thiếu ?path=");

    const filePath = path.join(PUBLIC_FOLDER, fileName);

    // Ngăn truy cập ngoài thư mục
    if (!filePath.startsWith(PUBLIC_FOLDER)) {
        return res.status(403).send("Truy cập không hợp lệ");
    }

    // Kiểm tra file tồn tại
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            return res.status(404).send("Không tìm thấy ảnh");
        }

        // Xác định MIME
        const ext = path.extname(filePath).toLowerCase();
        const mime = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".gif": "image/gif",
            ".webp": "image/webp",
        }[ext] || "application/octet-stream";

        // Set header và stream
        res.setHeader("Content-Type", mime);
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

module.exports = router;

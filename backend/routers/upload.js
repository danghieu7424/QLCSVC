const express = require('express');
const multer = require("multer");
const sharp = require('sharp');
const path = require("path");
const fs = require("fs");
const { verifyToken } = require("./modules/verifyToken");

const router = express.Router();

const AVATAR_FOLDER = path.join(__dirname, "./storages/avatars");

// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(AVATAR_FOLDER)) {
    fs.mkdirSync(AVATAR_FOLDER, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, AVATAR_FOLDER);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const userId = req.user?.id || "unknown"; // fallback nếu không có user
        cb(null, `avatar_${userId}${ext}`);
    },
});

const upload = multer({ storage });

router.post("/api/upload/avatar", verifyToken, upload.single("avatar"), async (req, res) => {
    const userId = req.user?.id;

    if (!req.file) return res.status(400).json({ message: "Không có file." });

    const tempFilePath = path.join(AVATAR_FOLDER, req.file.filename);
    const tempOutputFilePath = path.join(AVATAR_FOLDER, `avatar_${userId}_temp.png`); // Temporary output file

    try {
        // Sử dụng sharp để chuyển đổi file thành PNG
        await sharp(tempFilePath)
            .toFormat('png')
            .toFile(tempOutputFilePath);

        // Xóa file gốc (không phải PNG)
        fs.unlinkSync(tempFilePath);

        // Xoá các file avatar cũ của user (nếu cần)
        const files = fs.readdirSync(AVATAR_FOLDER);
        for (const file of files) {
            if (file.startsWith(`avatar_${userId}`) && file !== `avatar_${userId}_temp.png`) {
                fs.unlinkSync(path.join(AVATAR_FOLDER, file));
            }
        }

        // Rename the temporary output file to the final output file
        const finalOutputFilePath = path.join(AVATAR_FOLDER, `avatar_${userId}.png`);
        fs.renameSync(tempOutputFilePath, finalOutputFilePath);

        const avatarUrl = `/api/stream/avatar?path=avatar_${userId}.png`;
        return res.json({ url: avatarUrl });
    } catch (error) {
        console.error("Lỗi khi chuyển đổi file:", error);
        return res.status(500).json({ message: "Lỗi khi xử lý ảnh." });
    }
});

module.exports = router;

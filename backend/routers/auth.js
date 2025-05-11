const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const { queryDatabase } = require("./modules/mySQLConfig");
const fs = require("fs");
const path = require("path");
const { verifyToken } = require("./modules/verifyToken");
const writeLog = require("../logs/logs");

require("dotenv").config();

const router = express.Router();
const SECRET_KEY = process.env.qlcsvc_SECRET_KEY;

router.use(cookieParser());

// Đăng ký
router.post("/api/auth/register", async (req, res) => {
    const { username, password } = req.body;
    console.log({ username, password });

    try {
        // 1. Kiểm tra username đã tồn tại chưa
        const existing = await queryDatabase(
            "SELECT * FROM AUTH WHERE MaCanBo = ?",
            [username]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // 3. Thêm người dùng mới vào bảng AUTH
        await queryDatabase(
            "INSERT INTO AUTH (MaCanBo, MatKhau) VALUES (?, ?)",
            [username, hashedPassword]
        );

        // 4. Tạo token
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1d" });

        res.cookie("token", token, { httpOnly: true, secure: false });
        res.json({ message: "User registered", token });
    } catch (error) {
        res.status(500).json({
            message: "Register failed",
            error: error.message,
        });
    }
});

// Đăng nhập
router.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    // console.log("Login request:", { username, password });

    try {
        const results = await queryDatabase(
            `
            SELECT A.*, C.TenCanBo
            FROM AUTH A
            JOIN CANBO C ON A.MaCanBo = C.MaCanBo
            WHERE A.MaCanBo = ?
            `,
            [username]
        );

        // console.log("Truy vấn DB:", results);
        const user = results[0];

        if (!user) return res.status(401).json({ message: "User not found" });

        // Nếu mật khẩu là null, đăng nhập luôn
        if (!user.MatKhau) {
            return res
                .status(200)
                .json({ message: "Logged in (no password)", token: "" });
        }

        // console.log("So sánh mật khẩu:", password, "<>", user.MatKhau);

        const match = await bcrypt.compare(password, user.MatKhau);
        console.log("So khớp:", match);
        writeLog("So khớp:", match);

        if (!match)
            return res.status(401).json({ message: "Thông tin đăng nhập không hợp lệ." });

        const token = jwt.sign(
            {
                id: user.MaCanBo,
                TenCanBo: user.TenCanBo,
                Role: user.Role,
            },
            SECRET_KEY,
            {
                expiresIn: "1d",
            }
        );

        res.cookie("token", token, { httpOnly: true, secure: false });
        res.json({ message: "Logged in", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: error.message });
    }
});

router.post("/api/auth/change-password", verifyToken, async (req, res) => {
    const username = req.user.id;
    const { oldPassword, newPassword, confirmPassword } = req.body;
    console.log({ username, oldPassword, newPassword });

    if(newPassword !== confirmPassword) {
        return res.status(400).json({message: "Mật khẩu nhập lại không trùng khớp."})
    }

    try {
        // Truy vấn người dùng theo username
        const results = await queryDatabase(
            `SELECT * FROM AUTH WHERE MaCanBo = ?`,
            [username]
        );
        const user = results[0];

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Kiểm tra mật khẩu cũ
        const isOldPasswordValid = await bcrypt.compare(
            oldPassword,
            user.MatKhau
        );
        if (!isOldPasswordValid) {
            return res.status(401).json({ message: "Mật khẩu cũ không đúng." });
        }

        // Băm mật khẩu mới
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);

        // Cập nhật mật khẩu mới vào cơ sở dữ liệu
        await queryDatabase(`UPDATE AUTH SET MatKhau = ? WHERE MaCanBo = ?`, [
            hashedNewPassword,
            username,
        ]);

        res.json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ message: error.message });
    }
});

// Đăng xuất
router.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
});

router.post("/api/auth/verify", async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const maCanBo = decoded.id;

        const avatarPath = path.join(
            __dirname,
            "../storages/avatars",
            `avatar_${maCanBo}.png`
        );
        const avatarExists = fs.existsSync(avatarPath);

        const avatarUrl = avatarExists
            ? `/api/stream/avatar?path=avatar_${maCanBo}.png&t=${Date.now()}`
            : `/api/stream/avatar?path=defaultAvatar.jpg`;

        res.json({
            user: {
                TenCanBo: decoded.TenCanBo,
                Role: decoded.Role,
                Avatar: avatarUrl,
            },
        });
    } catch (err) {
        res.status(403).json({ message: "Invalid token" });
    }
});

module.exports = router;

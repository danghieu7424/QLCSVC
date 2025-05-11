const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const htdocs = require('./routers/htdocs');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: "http://localhost:8800", // ✅ Frontend domain
    credentials: true                // ✅ Phải có khi dùng cookie
}));

//htdocs
app.use('/', htdocs);

// Khởi động server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

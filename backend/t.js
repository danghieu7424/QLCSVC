const bcrypt = require("bcryptjs");

async function hashPassword() {
    // Đảm bảo bạn sử dụng salt rounds hợp lý, ví dụ như 10 thay vì 32
    const hashedNewPassword = await bcrypt.hash('1234', 10);
    console.log(hashedNewPassword);
}

hashPassword();

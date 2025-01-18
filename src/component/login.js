import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import "../assets/css/login.css"
import tbu1 from "../assets/img/tbu1.png";
import tbu2 from "../assets/img/tbu2.jpg";

function LoginPage() {
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault(); // Ngăn chặn tải lại trang
        // Logic xác thực nếu cần
        history.push("/"); // Chuyển hướng sang trang "/"
    };

    return (
        <div className="container-login" style={{ backgroundImage: `url(${tbu2})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="box-login">
                <div className="login-section">
                    <img className="logo" src={tbu1} alt="Thái Bình University" />
                    <h1>Welcome back!</h1>
                    <p>Sử dụng mã cán bộ và mật khẩu để đăng nhập</p>
                    <form onSubmit={handleSubmit}>
                        <input type="mcb" placeholder="Mã Cán Bộ" required />
                        <input type="password" placeholder="Mật Khẩu" required />
                        <div>
                            <input type="checkbox" id="remember" />
                            <label for="remember">Nhớ tài khoản trong 7 ngày</label>
                        </div>
                        <button type="submit" className="login-button">Login</button>
                    </form>
                </div>
                <div className="image-section"></div>
            </div>
        </div>
    )
}

export default LoginPage;
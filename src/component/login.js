import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import "../assets/css/login.css"
import tbu1 from "../assets/img/tbu1.png";
import tbu2 from "../assets/img/tbu2.jpg";

function LoginPage() {
    const history = useHistory();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const login = async (username, password) => {
        try {
            const response = await fetch("https://api-jwgltkza6q-uc.a.run.app/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password: password.toString() }),
            });

            if (response.ok) {
                const data = await response.json();
                history.push("/verify-otp", {
                    username: data.username,
                    email: data.email
                });
            } else {
                const data = await response.json();
                alert(data.error);
            }
        } catch (error) {
            alert("Có lỗi xảy ra, vui lòng thử lại.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        login(username, password);
    };

    return (
        <div className="container-login" style={{ backgroundImage: `url(${tbu2})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="box-login">
                <div className="login-section">
                    <img className="logo" src={tbu1} alt="Thái Bình University" />
                    <h1>Welcome back!</h1>
                    <p>Mời các thầy cô đăng nhập.</p>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="mcb"
                            placeholder="Mã Cán Bộ"
                            required
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Mật Khẩu"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div>
                            <input type="checkbox" id="remember" />
                            <label htmlFor="remember">Nhớ tài khoản trong 7 ngày</label>
                        </div>
                        <button type="submit" className="login-button">Login</button>
                    </form>
                </div>
                <div className="image-section"></div>
            </div>
        </div>
    );
}

function VerifyOTPPage({ location }) {
    const history = useHistory();
    const { username, email } = location.state; // Lấy email từ props
    const [otp, setOtp] = useState("");

    const verifyOTP = async () => {
        try {
            const response = await fetch("https://api-jwgltkza6q-uc.a.run.app/api/otp/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, otp }),
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                history.push("/"); // Điều hướng tới trang home sau khi xác thực thành công
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            alert("Có lỗi xảy ra, vui lòng thử lại.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Ngăn chặn tải lại trang
        verifyOTP(); // Gọi hàm xác thực OTP
    };

    return (
        <div className="container-login" style={{ backgroundImage: `url(${tbu2})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="box-login">
                <div className="login-section">
                    <img className="logo" src={tbu1} alt="Thái Bình University" />
                    <h1>Nhập Mã OTP</h1>
                    <p>Vui lòng nhập mã OTP đã được gửi đến email của bạn.</p>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="otp"
                            placeholder="Mã OTP"
                            required
                            onChange={(e) => setOtp(e.target.value)}
                            value={otp}
                        />
                        <button type="submit" className="login-button">Xác Nhận OTP</button>
                    </form>
                </div>
                <div className="image-section"></div>
            </div>
        </div>
    );
}

export { LoginPage, VerifyOTPPage };

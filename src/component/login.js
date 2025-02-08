import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from './authContext.js';

import "../assets/css/login.css"
import tbu1 from "../assets/img/tbu1.png";
import tbu2 from "../assets/img/tbu2.jpg";

function LoginPage() {
    const { login } = useAuth();
    const history = useHistory();


    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    const loginRequest = async (username, password, rememberMe) => {
        try {
            const response = await fetch("https://api-jwgltkza6q-uc.a.run.app/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password: password.toString(), rememberMe }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.otpRequired) {
                    // Nếu cần OTP, chuyển hướng sang trang nhập OTP
                    history.push("/verify-otp", { username: data.username, rememberMe });
                } else {
                    // Nếu không cần OTP, lưu token và đăng nhập ngay
                    const storage = rememberMe ? localStorage : sessionStorage;
                    storage.setItem("token", data.token);
                    login({ id: data.username, role: data.role });

                    history.push("/");
                }
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert("Có lỗi xảy ra, vui lòng thử lại.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        loginRequest(username, password, rememberMe);
    };

    return (
        <div className="container-login" style={{ backgroundImage: `url(${tbu2})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="box-login">
                <div className="login-section">
                    <img className="logo" src={tbu1} alt="Thái Bình University" />
                    <h1>Welcome back!</h1>
                    <p>Mời các thầy cô đăng nhập.</p>
                    <form onSubmit={handleSubmit}>
                        <div className="box-input">
                            <i className='icon-left bx bx-user' ></i>
                            <input
                                type="mcb"
                                placeholder="Mã Cán Bộ"
                                className="mcb-input"
                                required
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="box-input">
                            <i className='icon-left bx bx-key' ></i>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Mật Khẩu"
                                className="password-input"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <i
                                className={`icon-right bx ${showPassword ? "bx-hide" : "bx-show"}`}
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ cursor: "pointer" }}
                            ></i>
                        </div>

                        <div>
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
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
    const { login } = useAuth();
    const { username, rememberMe } = location.state || {}; // Lấy email từ props
    const [otp, setOtp] = useState("");

    const verifyOTP = async () => {
        try {
            const response = await fetch("https://api-jwgltkza6q-uc.a.run.app/api/otp/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, otp }),
            });

            if (response.ok) {
                const data = await response.json();
                const storage = rememberMe ? localStorage : sessionStorage;
                storage.setItem("token", data.token);
                login(data.user);
                console.log(data)
                history.push("/");
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

function ChangePasswordPage() {
    const history = useHistory();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const { userData, login } = useAuth();
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token && !userData) {
            fetch("https://api-jwgltkza6q-uc.a.run.app/protected-route", {
                method: "GET",
                headers: { Authorization: token },
            })
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data) login(data.user); // Cập nhật userData
                })
                .catch(error => {
                    console.error("Error during token verification: ", error);
                    localStorage.removeItem("token");
                    sessionStorage.removeItem("token");
                });
        }
    }, [userData, login]);

    const changePassword = async () => {
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            alert("Vui lòng nhập đầy đủ thông tin.");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            alert("mật khẩu không trùng nhau");
            return;
        }
        try {
            const response = await fetch("https://api-jwgltkza6q-uc.a.run.app/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: userData.id, oldPassword, newPassword }),
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                history.push("/");
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            alert("Có lỗi xảy ra, vui lòng thử lại.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        changePassword();
    };

    return (
        <div className="container-login" style={{ backgroundImage: `url(${tbu2})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="box-login">
                <div className="login-section">
                    <img className="logo" src={tbu1} alt="Thái Bình University" />
                    <h1>Đổi mật khẩu</h1>
                    <p>Vui lòng nhập mật khẩu mới.</p>
                    <form onSubmit={handleSubmit}>
                        <div className="box-input">
                            <input
                                type={showOldPassword ? "text" : "password"}
                                placeholder="Mật khẩu cũ"
                                required
                                onChange={(e) => setOldPassword(e.target.value)}
                                value={oldPassword}
                            />
                            <i
                                className={`icon-right bx ${showOldPassword ? "bx-hide" : "bx-show"}`}
                                onClick={() => setShowOldPassword(!showOldPassword)}
                                style={{ cursor: "pointer" }}
                            ></i>
                        </div>
                        <div className="box-input">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Mật khẩu mới"
                                required
                                onChange={(e) => setNewPassword(e.target.value)}
                                value={newPassword}
                            />    
                            <i
                                className={`icon-right bx ${showNewPassword ? "bx-hide" : "bx-show"}`}
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                style={{ cursor: "pointer" }}
                            ></i>
                        </div>
                        <div className="box-input">
                            <input
                                type={showConfirmNewPassword ? "text" : "password"}
                                placeholder="Nhập lại mật khẩu"
                                required
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                value={confirmNewPassword}
                            />    
                            <i
                                className={`icon-right bx ${showConfirmNewPassword ? "bx-hide" : "bx-show"}`}
                                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                style={{ cursor: "pointer" }}
                            ></i>
                        </div>
                        <button type="submit" className="login-button">Đổi mật khẩu</button>
                    </form>
                </div>
                <div className="image-section"></div>
            </div>
        </div>
    )
}

export { LoginPage, VerifyOTPPage, ChangePasswordPage };

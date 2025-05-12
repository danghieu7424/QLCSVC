import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API_BASE_URL from "./base/config";

import "../access/css/header.css";

export default function Header() {
    const infoRef = useRef(null);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [showInForMore, setShowInForMore] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (infoRef.current && !infoRef.current.contains(event.target)) {
                setShowInForMore(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/auth/verify`, {
                    method: "POST",
                    credentials: "include", // gửi cookie chứa token
                });

                if (!res.ok) {
                    setError("Phiên đăng nhập không hợp lệ!");
                    return;
                }

                const data = await res.json();
                setUser(data.user);
                console.log("User Info:", data.user);
            } catch (err) {
                setError("Lỗi khi xác thực!");
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const onAvatarUpdate = (e) => {
            setUser(e.detail);
        };

        window.addEventListener("userUpdated", onAvatarUpdate);

        return () => {
            window.removeEventListener("userUpdated", onAvatarUpdate);
        };
    }, []);

    const handleLogout = () => {
        // Gửi request logout hoặc xoá cookie phía client
        fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: "POST",
            credentials: "include",
        }).then(() => {
            setUser(null);
            navigate("/login");
        });
    };

    const handleProfile = () => {
        navigate("/profile");
    };

    return (
        <header className="header_container">
            <div className="header-left">
                <Link to="/">
                    <div
                        style={{
                            position: "relative",
                            width: "2.5rem",
                            aspectRatio: "1/1",
                            background: `url(${API_BASE_URL}/api/stream/public?path=tbu1.png)`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    ></div>
                </Link>
            </div>
            <div className="header-right">
                {user ? (
                    <>
                        <div className="navigation">
                            <ul>
                                <li>
                                    Cơ sở vật chất
                                    <ul className="drop_down">
                                        <>
                                            {(user.Role === "manager" ||
                                                user.Role === "user") && (
                                                    <>
                                                        {/* <li>
                                                            <Link to="/tong-quan-hoc-phan">
                                                                Tổng quan Học Phần
                                                            </Link>
                                                        </li>*/}
                                                        <li>
                                                            <Link to="/quan-ly-phong-page">
                                                                Quản lý phòng
                                                            </Link>
                                                        </li> 
                                                        <li>
                                                            <Link to="/loai-thiet-bi">
                                                                Loại thiết bị
                                                            </Link>
                                                        </li> 
                                                    </>
                                                )}
                                            {user.Role === "manager" && (
                                                <>
                                                    {/* <li>
                                                        <Link to="/truong-hoc-phan">
                                                            Trưởng Học Phần
                                                        </Link>
                                                    </li> */}
                                                </>
                                            )}
                                        </>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        <div
                            className="user-info"
                            style={{
                                margin: 0,
                                display: "flex",
                                alignItems: "center",
                            }}
                            onClick={() => setShowInForMore((state) => !state)}
                        >
                            <img
                                src={`${API_BASE_URL}${user.Avatar}`}
                                alt="avatar"
                                style={{
                                    width: "2.25rem",
                                    height: "2.25rem",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    marginRight: ".625rem",
                                }}
                            />
                            <span style={{ fontWeight: "600" }}>
                                {user.TenCanBo}
                            </span>
                            <span style={{ padding: ".1875rem" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24">
                                    <path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"></path>
                                </svg>
                            </span>

                            <div
                                className={`user-info-more${showInForMore ? " active" : ""
                                    }`}
                                ref={infoRef}
                            >
                                <ul>
                                    <li onClick={handleProfile}>Thông tin cá nhân.</li>
                                    <li onClick={handleLogout}>Đăng xuất</li>
                                </ul>
                            </div>
                        </div>
                    </>
                ) : (
                    <Link to="/login" className="handleLogin">
                        Đăng nhập
                    </Link>
                )}
            </div>
        </header>
    );
}

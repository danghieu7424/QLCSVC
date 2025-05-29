import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "./base/config";
import { InputChange } from "./base/formContainer.js";

import "../access/css/profilePage.css";

export default function ProfilePage() {
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState('');
    const fileInputRef = useRef();

    const fetchData = async () => {
        try {
            const resRaw = await fetch(`${API_BASE_URL}/api/select/profile`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            const result = await resRaw.json();

            if (!resRaw.ok)
                throw new Error(result.message || "Lỗi lấy dữ liệu.");

            console.log("Profile data:", result.data);
            setData(result.data);
            // console.log(result);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUser = async () => {
        try {
            const userRes = await fetch(`${API_BASE_URL}/api/auth/verify`, {
                method: "POST",
                credentials: "include",
            });

            const userData = await userRes.json();
            if (!userRes.ok) throw new Error(result.message || "Lỗi.");

            return userData.user;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    useEffect(() => {
        const init = async () => {
            const user = await fetchUser();

            if (user) {
                setAvatarUrl(`${API_BASE_URL}${user.Avatar}`);
            }

            fetchData(); // Hàm khác của bạn
        };

        init();
    }, []);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Hiển thị hộp thoại xác nhận
        const confirm = window.confirm("Bạn có muốn đổi ảnh đại diện?");
        if (!confirm) return;

        try {
            const formData = new FormData();
            formData.append("avatar", file);

            const res = await fetch(`${API_BASE_URL}/api/upload/avatar`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Lỗi upload.");

            // Cập nhật ảnh mới sau khi upload thành công
            await fetchData(); // Cập nhật thông tin người dùng

            const user = await fetchUser();
            window.dispatchEvent(
                new CustomEvent("userUpdated", { detail: user })
            );
            setAvatarUrl(`${API_BASE_URL}${user.Avatar}`);
        } catch (error) {
            console.error("Upload avatar thất bại:", error);
        } finally {
            fileInputRef.current.value = null;
        }
    };

    const handleChangePassword = () => {
        navigate("/change-password");
    }

    return (
        <div className="page-container profile-container">
            <div className="box_profile">
                <div className="box_avatar">
                    <div
                        className="box_avatar-img"
                        style={{
                            backgroundImage: `url(${avatarUrl})`, // Default to no background if data.MaCanBo is not available
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                        />
                        <div
                            className="box_avatar-change"
                            onClick={() => fileInputRef.current.click()}
                        >
                            <svg viewBox="0 0 24 24">
                                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path>
                            </svg>
                        </div>
                    </div>
                    <div
                        className="edit_account"
                    >
                        <ul>
                            <li onClick={handleChangePassword}>Đổi mật khẩu</li>
                        </ul>
                    </div>
                </div>
                <div className="box_info">
                    {!loading && data && (
                        <>
                            <div>
                                <span>{data.MaCanBo}</span>
                            </div>
                            <div>
                                <InputChange
                                    value={data.TenCanBo || "Nhập tên cán bộ."}
                                />
                            </div>
                            <div>
                                <InputChange
                                    value={
                                        data.SoDienThoai ||
                                        "Nhập số điện thoại."
                                    }
                                />
                            </div>
                            <div>
                                <span>{data.ChucVu}</span>
                            </div>
                            <div>
                                <span>{data.TenNganh}</span>
                            </div>
                            <div>
                                <span>{data.TenKhoa}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

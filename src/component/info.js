import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "./authContext.js";

import "../assets/css/infoPage.css";

export default function Info() {
    const { userData, login, logout } = useAuth();
    const [formData, setFormData] = useState({
        TenCanBo: "",
        MaPhongXuong: "",
        SoDienThoai: "",
        Email: "",
        useOTP: false,
    });
    const fetchedData = useRef(false);

    useEffect(() => {
        const token =
            localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token && !userData) {
            fetch("https://api-jwgltkza6q-uc.a.run.app/protected-route", {
                method: "GET",
                headers: { Authorization: token },
            })
                .then((res) => (res.ok ? res.json() : null))
                .then((data) => {
                    if (data) login(data.user); // Cập nhật userData
                })
                .catch((error) => {
                    console.error("Error during token verification: ", error);
                    localStorage.removeItem("token");
                    sessionStorage.removeItem("token");
                });
        }
    }, [userData, login]);

    useEffect(() => {
        if (!userData || !userData.id || fetchedData.current) return;
        fetchedData.current = true;

        fetch("https://api-jwgltkza6q-uc.a.run.app/api/select/canbo-id", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: userData.id }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.data) {
                    setFormData((prev) => ({
                        TenCanBo: data.data.TenCanBo || "",
                        MaPhongXuong: data.data.MaPhongXuong || "",
                        SoDienThoai: data.data.SoDienThoai || "",
                        Email: data.data.Email || "",
                        useOTP: data.data.useOTP ?? false,
                    }));
                    console.log("Dữ liệu nhận được:", data);
                }
            })
            .catch((err) => {
                console.error("Lỗi khi gọi API:", err.message);
            });
    }, [userData]);

    const updateInfo = () => {
        console.log(userData)
        if (!userData || !userData.id) return;

        fetch("https://api-jwgltkza6q-uc.a.run.app/api/update/canbo-id", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: userData.id,
                TenCanBo: formData.TenCanBo,
                MaPhongXuong: formData.MaPhongXuong,
                SoDienThoai: formData.SoDienThoai,
                Email: formData.Email,
                useOTP: formData.useOTP,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message);
            })
            .catch((err) => {
                alert(err.message);
                console.error("Lỗi khi gọi API:", err.message);
            });
    }

    const [editField, setEditField] = useState(null); // Lưu trạng thái ô đang chỉnh sửa

    // Xử lý thay đổi dữ liệu
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="box_info_container">
            {[
                { label: "Cán bộ", key: "TenCanBo" },
                { label: "Quản lý phòng", key: "MaPhongXuong" },
                { label: "Số điện thoại", key: "SoDienThoai" },
                { label: "Email", key: "Email" },
            ].map(({ label, key }) => (
                <div className="box_info" key={key}>
                    <span className="box_info-left">{label}:</span>
                    {editField === key ? (
                        <input
                            name={key}
                            value={formData[key]}
                            onChange={handleChange}
                            onBlur={() => setEditField(null)} // Khi mất focus, chuyển lại thành span
                            autoFocus
                            placeholder="Nhập thông tin"
                        />
                    ) : (
                        <span
                            onDoubleClick={() => setEditField(key)}
                            className="editable"
                            style={{width: '100%', height: '100%'}}
                        >
                            {formData[key] || <span style={{width: '100%', height: '100%'}}></span>}
                        </span>
                    )}
                </div>
            ))}

            <div className="box_info">
                <span className="box_info-left">Sử dụng OTP</span>
                <div className="input_check">
                    <input
                        type="checkbox"
                        id="input_checkbox"
                        hidden
                        checked={formData.useOTP}
                        onChange={() =>
                            setFormData({
                                ...formData,
                                useOTP: !formData.useOTP,
                            })
                        }
                    />
                    <label htmlFor="input_checkbox" className="switch"></label>
                </div>
            </div>

            <div className="box_info-center">
                <button onClick={updateInfo}>Lưu</button>
            </div>
        </div>
    );
}

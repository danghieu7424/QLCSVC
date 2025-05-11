import React, { useEffect, useState } from "react";

import "../access/css/dashboard.css"

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/auth/verify", {
                    method: "POST",
                    credentials: "include", // ✅ gửi cookie kèm theo
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

    return (
        <div className="dashboard">
            <h2>Thông tin người dùng</h2>
            {error ? (
                <p className="error-text">{error}</p>
            ) : user ? (
                <div>
                    <p>
                        <strong>Username:</strong> {user.TenCanBo}
                    </p>
                </div>
            ) : (
                <p>Đang tải...</p>
            )}
        </div>
    );
};

export default Dashboard;

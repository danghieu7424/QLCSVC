import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API_BASE_URL from "./base/config";

import "../access/css/auth.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword((state) => !state);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Xóa lỗi khi người dùng nhập lại
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        navigate("/");
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Lỗi hệ thống!"); // Xử lý lỗi hệ thống
    }
  };

  useEffect(() => {
    const label = document
      .querySelectorAll("#box_input-container label")
      .forEach((label) => {
        label.innerHTML = label.innerText
          .split("")
          .map(
            (letters, i) =>
              `<span style="transition-delay: ${i * 50}ms">${letters}</span>`
          )
          .join("");
      });
  }, []);

  return (
    <div className="box-auth-container">
      <div className="auth-container">
        <h2 className="box-title-auth">Login</h2>

        <form onSubmit={handleSubmit}>
          <div id="box_input-container">
            <span className="icon-show icon-input">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"></path>
              </svg>
            </span>
            <input
              type="text"
              name="username"
              onChange={handleChange}
              required
              autoComplete="off"
              autoFocus
            />
            <label>userName</label>
          </div>
          <div id="box_input-container">
            <span className="icon-show icon-input">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M12 2C9.243 2 7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zm6 10 .002 8H6v-8h12zm-9-2V7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9z"></path>
              </svg>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              required
            />
            <label>password</label>
            <span
              className="icon-show show-password"
              onClick={handleShowPassword}
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                {showPassword ? (
                  <>
                    <path d="M12 19c.946 0 1.81-.103 2.598-.281l-1.757-1.757c-.273.021-.55.038-.841.038-5.351 0-7.424-3.846-7.926-5a8.642 8.642 0 0 1 1.508-2.297L4.184 8.305c-1.538 1.667-2.121 3.346-2.132 3.379a.994.994 0 0 0 0 .633C2.073 12.383 4.367 19 12 19zm0-14c-1.837 0-3.346.396-4.604.981L3.707 2.293 2.293 3.707l18 18 1.414-1.414-3.319-3.319c2.614-1.951 3.547-4.615 3.561-4.657a.994.994 0 0 0 0-.633C21.927 11.617 19.633 5 12 5zm4.972 10.558-2.28-2.28c.19-.39.308-.819.308-1.278 0-1.641-1.359-3-3-3-.459 0-.888.118-1.277.309L8.915 7.501A9.26 9.26 0 0 1 12 7c5.351 0 7.424 3.846 7.926 5-.302.692-1.166 2.342-2.954 3.558z"></path>
                  </>
                ) : (
                  <>
                    <path d="M12 9a3.02 3.02 0 0 0-3 3c0 1.642 1.358 3 3 3 1.641 0 3-1.358 3-3 0-1.641-1.359-3-3-3z"></path>
                    <path d="M12 5c-7.633 0-9.927 6.617-9.948 6.684L1.946 12l.105.316C2.073 12.383 4.367 19 12 19s9.927-6.617 9.948-6.684l.106-.316-.105-.316C21.927 11.617 19.633 5 12 5zm0 12c-5.351 0-7.424-3.846-7.926-5C4.578 10.842 6.652 7 12 7c5.351 0 7.424 3.846 7.926 5-.504 1.158-2.578 5-7.926 5z"></path>
                  </>
                )}
              </svg>
            </span>
          </div>
          {error && <p className="error-text">{error}</p>}{" "}
          <button type="submit">Đăng Nhập</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

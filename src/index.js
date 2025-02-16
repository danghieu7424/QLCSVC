import React from 'react'
import ReactDOM from 'react-dom'
import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useLocation, useHistory } from 'react-router-dom';
import { Navigation, Home, Header } from './component/home.js';
import { Overview } from './component/overview.js';
import { CanBo } from './component/canbo.js';
import { PhongCNTT, TLTaiSanCNTT, TaiSanCNTT } from './component/cntt.js';
import { PhongDDTU, TLTaiSanDDTU, TaiSanDDTU } from './component/ddtu.js';
import { PhongKTCK, TLTaiSanKTCK, TaiSanKTCK } from './component/ktck.js';
import { LoginPage, VerifyOTPPage , ChangePasswordPage } from './component/login.js';
import thietBi from './component/thietBi.js';
import ChuyenThietBiPage from './component/chuyenThietBi.js';
import MuaThietBiPage from './component/muaThietBi.js';
import ThanhLyThietBiPage from './component/thanhLyThietBi.js';
import TextEditor from './component/doc.js';

import { AuthProvider } from './component/authContext.js';

// ------------ CSS ---------------
// index.js
import './assets/css/style.css';
import './assets/css/base.css';
import './assets/css/navigation.css';
import './assets/css/functions.css';
import './assets/css/table.css';
import './assets/fonts/fonts_css/fonts.css';

// ----------------------------

function Loader() {
    return (
        <div className="showbox">
            <div className="loader">
                <svg className="circular" viewBox="25 25 50 50">
                    <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10" />
                </svg>
            </div>
        </div>
    );
}

// Component chính
function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Giả lập thời gian tải (có thể thay bằng logic tải thực tế)
        const timer = setTimeout(() => {
            setLoading(false); // Tắt Loader sau khi tải xong
        }, 500); // 2 giây

        // Dọn dẹp
        return () => clearTimeout(timer);
    }, []);

    // localStorage.removeItem("token");



    const Layout = () => {
        const location = useLocation(); // Lấy thông tin đường dẫn hiện tại
        const showHeaderAndNavigation = location.pathname === "/login" || location.pathname === "/verify-otp" || location.pathname === "/change-password" || location.pathname === "/doc" ; // Điều kiện hiển thị

        return (
            <>
                {!showHeaderAndNavigation && (
                    <>
                        <Header />
                        <Navigation />
                    </>
                )}
                <Switch>
                    <Route exact path="/login" component={LoginPage} />
                    <Route exact path="/verify-otp" component={VerifyOTPPage} />
                    <Route exact path="/change-password" component={ChangePasswordPage} />
                    <Route exact path="/" component={Home} />
                    <Route exact path="/lich-su" component={Home} />
                    <Route exact path="/nganh-cntt" component={Home} />
                    <Route exact path="/nganh-ddt" component={Home} />
                    <Route exact path="/nganh-kt" component={Home} />
                    {/* Các route khác */}
                    <Route exact path="/tong-quan" component={Overview} />
                    <Route exact path="/can-bo" component={CanBo} />
                    <Route exact path="/CNTT/phong" component={PhongCNTT} />
                    <Route exact path="/D_DT/phong" component={PhongDDTU} />
                    <Route exact path="/KTCK/phong" component={PhongKTCK} />
                    <Route exact path="/thiet-bi" component={thietBi} />
                    <Route exact path="/ChuyenThietBi" component={ChuyenThietBiPage} />
                    <Route exact path="/MuaThietBi" component={MuaThietBiPage} />
                    <Route exact path="/ThanhLyThietBi" component={ThanhLyThietBiPage} />
                    <Route exact path="/doc" component={TextEditor} />
                </Switch>
            </>
        );
    };

    return (
        <Router>
            {loading ? <Loader /> : <Layout />}
        </Router>
    );
}

// Render ứng dụng React vào phần tử có id 'root'
ReactDOM.render(<AuthProvider><App /></AuthProvider>, document.getElementById("root"));

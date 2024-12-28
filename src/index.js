import React from 'react'
import ReactDOM from 'react-dom'
import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useLocation, useHistory } from 'react-router-dom';
import { Navigation, Home, Header, Home_p2, Home_p3, Home_p4, Home_p5  } from './home.js';
import { Overview } from './overview.js';
import { CanBo } from './canbo.js';
import { PhongCNTT, TLTaiSanCNTT, TaiSanCNTT } from './cntt.js';
import { PhongDDTU, TLTaiSanDDTU, TaiSanDDTU } from './ddtu.js';
import { PhongKTCK, TLTaiSanKTCK, TaiSanKTCK } from './ktck.js';

// ------------ CSS ---------------
// index.js
import './assets/css/style.css';
import './assets/css/base.css';
import './assets/css/navigation.css';
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
    return (
        <Router>
            <React.Fragment>
                {loading && <Loader />}
                {!loading && (
                    <>
                        <Header />
                        <Navigation />
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route exact path="/lich-su" component={Home_p2} />
                            <Route exact path="/nganh-cntt" component={Home_p3} />
                            <Route exact path="/nganh-ddt" component={Home_p4} />
                            <Route exact path="/nganh-kt" component={Home_p5} />
                            {/* Các route khác */}
                            <Route exact path="/tong-quan" component={Overview} />
                            <Route exact path="/can-bo" component={CanBo} />
                            <Route exact path="/CNTT/phong" component={PhongCNTT} />
                            <Route exact path="/D_DT/phong" component={PhongDDTU} />
                            <Route exact path="/KTCK/phong" component={PhongKTCK} />

                            <Route exact path="/CNTT/tai_san" component={TaiSanCNTT} />
                            <Route exact path="/D_DT/tai_san" component={TaiSanDDTU} />
                            <Route exact path="/KTCK/tai_san" component={TaiSanKTCK} />

                            <Route
                                exact
                                path="/CNTT/thanh_ly_tai_san"
                                component={TLTaiSanCNTT}
                            />
                            <Route
                                exact
                                path="/D_DT/thanh_ly_tai_san"
                                component={TLTaiSanDDTU}
                            />
                            <Route
                                exact
                                path="/KTCK/thanh_ly_tai_san"
                                component={TLTaiSanKTCK}
                            />
                        </Switch>
                    </>
                )}
            </React.Fragment>
        </Router>
    );
}

// Render ứng dụng React vào phần tử có id 'root'
ReactDOM.render(<App />, document.getElementById("root"));

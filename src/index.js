import React from 'react'
import ReactDOM from 'react-dom'
import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useLocation, useHistory } from 'react-router-dom';
import { Navigation, Home, Header } from './home.js';
import { PhongCNTT , TLTaiSanCNTT, TaiSanCNTT } from './cntt.js';
import { PhongDDTU , TLTaiSanDDTU, TaiSanDDTU } from './ddtu.js';
import { PhongKTCK , TLTaiSanKTCK, TaiSanKTCK } from './ktck.js';

// ------------ CSS ---------------
// index.js
import './assets/css/style.css';
import './assets/css/base.css';
import './assets/css/loader.css';
import './assets/css/navigation.css';
import './assets/css/table.css';
import './assets/fonts/fonts_css/fonts.css';

// ----------------------------

function Loader() {
    useEffect(() => {
        const startLoader = () => {
            document.querySelector(".overLoader").classList.add("active");
        };

        const endLoader = () => {
            const loadingScreen = document.querySelector(".overLoader");
            setTimeout(() => {
                loadingScreen.classList.remove("active");
                setTimeout(() => {
                    loadingScreen.classList.remove("active");
                }, 500);
            }, 500);
        };

        // Chạy loader khi DOM đã được load
        document.addEventListener("DOMContentLoaded", () => {
            startLoader();
            endLoader();
        });

        // Cleanup khi component bị unmount
        return () => {
            document.removeEventListener("DOMContentLoaded", () => {
                startLoader();
                endLoader();
            });
        };
    }, []); // Mảng phụ thuộc rỗng để chỉ chạy 1 lần khi component mount

    return (
        <div className="overLoader">
            <div className="loader">
                <svg viewBox="0 0 80 80">
                    <circle id="test" cx="40" cy="40" r="32"></circle>
                </svg>
            </div>
        </div>
    );
}

// Component chính
function App() {
    return (
        <Router>
            <React.Fragment>
                <Loader />
                <Header />
                <Navigation />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/CNTT/phong" component={PhongCNTT} />
                    <Route exact path="/D_DT/phong" component={PhongDDTU} />
                    <Route exact path="/KTCK/phong" component={PhongKTCK} />

                    <Route exact path="/CNTT/tai_san" component={TaiSanCNTT} />
                    <Route exact path="/D_DT/tai_san" component={TaiSanDDTU} />
                    <Route exact path="/KTCK/tai_san" component={TaiSanKTCK} />

                    <Route exact path="/CNTT/thanh_ly_tai_san" component={TLTaiSanCNTT} />
                    <Route exact path="/D_DT/thanh_ly_tai_san" component={TLTaiSanDDTU} />
                    <Route exact path="/KTCK/thanh_ly_tai_san" component={TLTaiSanKTCK} />
                </Switch>
            </React.Fragment>
        </Router>
    );
}

// Render ứng dụng React vào phần tử có id 'root'
ReactDOM.render(<App />, document.getElementById("root"));

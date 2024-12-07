import React from 'react'
import ReactDOM from 'react-dom'
import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Route, Switch, Link, useLocation, useHistory } from 'react-router-dom';
import { Navigation, Home, Header } from './home.js';
import { PhongCNTT } from './cntt.js';
import { PhongDDTU } from './ddtu.js';
import { PhongKTCK } from './ktck.js';


const { encode, decode } = Cryptage;


function D_DT() {
    return <h1 style={{ paddingTop: "4rem" }}>Đ-ĐT</h1>;
}
function KTCK() {
    return <h1 style={{ paddingTop: "4rem" }}>KTCK</h1>;
}

// Component chính
function App() {
    return (
        <BrowserRouter>
            <div>
                <Header />
                <Navigation />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/CNTT/phong" component={PhongCNTT} />
                    <Route exact path="/D_DT/phong" component={PhongDDTU} />
                    <Route exact path="/KTCK/phong" component={PhongKTCK} />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

// Render ứng dụng React vào phần tử có id 'root'
ReactDOM.render(<App />, document.getElementById("root"));

import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  useLocation,
} from "react-router-dom";
import Header from "./components/header.js";
import HomePage from "./components/homePage.js";
import LoginPage from "./components/loginPage.js";
import ProfilePage from "./components/profilePage.js";

import QuanLyPhongPage from "./components/quanLyPhongPage.js";

import { LoaderPage } from "./components/base/LoaderForm.js";

// ------------ CSS ---------------
import "./components/base/toast.js";
import "./components/base/loader.js";
import "./access/css/base.css";
import "./access/fonts/fonts_css/fonts.css";
// --------------------------------

// Component chính
function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <MainContent loading={loading} />
    </Router>
  );
}

// Tách phần chính để sử dụng useLocation (vì Router phải bọc bên ngoài)
function MainContent({ loading }) {
  const location = useLocation();
  const hideHeader =
    location.pathname === "/login" || location.pathname === "/change-password";

  return (
    <React.Fragment>
      {loading && <LoaderPage />}
      {!loading && (
        <>
          {!hideHeader && <Header />}
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/change-password" component={LoginPage} />
            <Route exact path="/profile" component={ProfilePage} />
            <Route exact path="/quan-ly-phong-page" component={QuanLyPhongPage} />
          </Switch>
        </>
      )}
    </React.Fragment>
  );
}

// Render ứng dụng React vào phần tử có id 'root'
ReactDOM.render(<App />, document.getElementById("root"));

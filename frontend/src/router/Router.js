import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';

import { TransitionProvider } from '../context/TransitionContext';
import TransitionComponent from '../components/Transition';

import HomePage from "../components/homePage.js";
import LoginPage from "../components/loginPage.js";
import ProfilePage from "../components/profilePage.js";
import ChangePasswordPage from "../components/changePasswordPage.js";
import LoaiThietBiPage from "../components/loaiThietBiPage.js";
import ThietBiPage from "../components/thietBiPage.jsx";
import ThietBiTrongPhongPage from "../components/thietBiTrongPhongPage.jsx";

import QuanLyPhongPage from "../components/quanLyPhongPage.js";

const Router = () => {
  return (
    <TransitionProvider>
      <Routes>
        <Route
          index
          element={
            <TransitionComponent>
              <HomePage />
            </TransitionComponent>
          }
        />
        <Route
          path="/login"
          element={
            <TransitionComponent>
              <LoginPage />
            </TransitionComponent>
          }
        />
        <Route
          path="/change-password"
          element={
            <TransitionComponent>
              <ChangePasswordPage />
            </TransitionComponent>
          }
        />
        <Route
          path="/profile"
          element={
            <TransitionComponent>
              <ProfilePage />
            </TransitionComponent>
          }
        />
        <Route
          path="/quan-ly-phong-page"
          element={
            <TransitionComponent>
              <QuanLyPhongPage />
            </TransitionComponent>
          }
        />
        <Route
          path="/loai-thiet-bi"
          element={
            <TransitionComponent>
              <LoaiThietBiPage />
            </TransitionComponent>
          }
        />
        <Route
          path="/thiet-bi"
          element={
            <TransitionComponent>
              <ThietBiPage />
            </TransitionComponent>
          }
        />
        <Route
          path="/thiet-bi-trong-phong"
          element={
            <TransitionComponent>
              <ThietBiTrongPhongPage />
            </TransitionComponent>
          }
        />
      </Routes>
    </TransitionProvider>
  );
};

export default Router;

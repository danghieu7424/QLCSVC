import React from 'react';
import gsap from 'gsap';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';

import Header from "./components/header.js";
import Router from './router/Router.js';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

function App() {
  const location = useLocation();
  const hideHeader =
    location.pathname === "/login" || location.pathname === "/change-password";
  return (
    <>
      {!hideHeader && <Header />}
      <Router />
    </>
  );
}

export default App;

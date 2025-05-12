import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

// ------------ CSS ---------------
import "./components/base/toast.js";
import "./components/base/loader.js";
import "./access/css/base.css";
import "./access/fonts/fonts_css/fonts.css";
// --------------------------------

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AdminPage from './AdminPage';

const isAdminPath = /^\/admin\/?$/.test(window.location.pathname);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {isAdminPath ? <AdminPage /> : <App />}
  </React.StrictMode>
);

// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Change this to import from 'react-dom/client'
import App from './App';

// Create a root and render the App
const root = ReactDOM.createRoot(document.getElementById('root')); // Use createRoot instead of render
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

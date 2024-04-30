import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import axios from 'axios';

axios.defaults.headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json;charset=UTF-8'
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);
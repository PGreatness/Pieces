import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const dotenv = require('dotenv');

async function getData() {
  let url = `${process.env.BACKEND_URL}`;
  let response = await fetch(url);
  return await response.json();
}

window.onload = () => {
  async function run() {
    let data = await getData();
    console.log(data);
  }
  run();
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

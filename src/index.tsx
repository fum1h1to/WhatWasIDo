import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './view/templates/App';

if (process.env.NODE_ENV !== "development") {
  console.error = () => {};
  console.debug = () => {};
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
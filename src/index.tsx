import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './view/pages/App';

import { createTheme, ThemeProvider } from '@mui/material/styles';

const mdTheme = createTheme({
  palette: {
    mode: "dark",
  }
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={mdTheme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
import React from 'react';
import App from './App';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { CookiesProvider } from 'react-cookie';

import './index.css';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
// import '@fortawesome/fontawesome-free/css/all.min.css';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import { CookiesProvider } from 'react-cookie';
// import { BrowserRouter } from 'react-router-dom';
// import { ThemeProvider } from './ThemeContext'; // Import your context provider

// import './index.css';
// import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap/dist/js/bootstrap";
// import "bootstrap-icons/font/bootstrap-icons.css";

// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );

// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <CookiesProvider>
//         <ThemeProvider> {/* Wrap your app with ThemeProvider */}
//           <App />
//         </ThemeProvider>
//       </CookiesProvider>
//     </BrowserRouter>
//   </React.StrictMode>
// );

// reportWebVitals();

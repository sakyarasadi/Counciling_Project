import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import RouterConfig from './routes/router.config';
// import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {
  return (
    <>
      <BrowserRouter>
        <RouterConfig/>
      </BrowserRouter>
    </>
  );
}

export default App;

// import React from 'react';
// import RouterConfig from './routes/router.config';
// import './App.css';

// function App() {
//   return <RouterConfig />;
// }

// export default App;

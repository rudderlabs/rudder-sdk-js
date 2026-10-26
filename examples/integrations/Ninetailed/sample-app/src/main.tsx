import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './ninetailed';
import useRudderAnalytics from './useRudderAnalytics';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App useAnalytics={useRudderAnalytics} />
  </React.StrictMode>,
);

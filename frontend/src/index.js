import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import {Provider as AlertProvider ,positions,transitions} from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

const options={
  positions:positions.BOTTOM_CENTER,
  transitions:transitions.SCALE,
  timeout:3000,
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AlertProvider template={AlertTemplate}{...options}>
      <App />
      </AlertProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

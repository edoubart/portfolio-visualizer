// NPM Packages
import React from 'react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

// Custom Modules
import store from './store';
import { App } from './containers';

// Styles
import 'semantic-ui-css/semantic.min.css'
import './index.css';

const app = (
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);

const rootSelector = document.getElementById('root');

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(app, rootSelector);
});

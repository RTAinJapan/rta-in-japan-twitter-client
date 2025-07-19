import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import App from './components/pages/App';
import configureStore from './store';

const container = document.getElementById('root');
const root = createRoot(container as Element);
root.render(
  <Provider store={configureStore()}>
    <App />
  </Provider>,
);

if ((module as any).hot) {
  (module as any).hot.accept();
}

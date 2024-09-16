import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import App from './components/pages/App';
import configureStore from './store';
import * as serviceWorker from './serviceWorker';
import { SWUpdateDialog } from './components/organisms/SWUpdateDialog';

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

serviceWorker.register({
  onSuccess: (registration) => {
    console.log(`'ServiceWorker registration successful with scope: ${registration.scope}`);
  },
  onUpdate: (registration) => {
    if (registration.waiting) {
      const container = document.querySelector('.SW-update-dialog');
      const updater = createRoot(container as Element);
      updater.render(<SWUpdateDialog registration={registration} />);
    }
  },
});

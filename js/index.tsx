import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './components/pages/App';
import configureStore from './store';
import { MuiThemeProvider } from '@material-ui/core';
import { theme } from './theme';

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={configureStore()}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root'),
);

if ((module as any).hot) {
  (module as any).hot.accept();
}

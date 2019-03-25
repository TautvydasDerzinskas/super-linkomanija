import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import 'react-tippy/dist/tippy.css';
import './popup.meta';

import AppComponent from './popup/app.component';

ReactDOM.render(
  <HashRouter>
    <AppComponent />
  </HashRouter>,
  document.getElementById('application')
);

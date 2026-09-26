import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router';

import './popup.meta';

import AppComponent from './popup/app.component';

createRoot(document.getElementById('application')).render(
  <HashRouter>
    <AppComponent />
  </HashRouter>
);

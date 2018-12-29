

import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

// Layout components
import HeaderComponent from './layout/header/header.component';

// Tab components
import HistoryComponent from './tabs/history/history.component';
import FeaturesComponent from './tabs/features/features.component';
import LinksComponent from './tabs/links/links.component';

import './app.component.scss';

export default class AppComponent extends React.Component<{}> {
  render() {
    return (
      <div>
        <HeaderComponent />
        <div className='tabs-content'>
          <Switch>
            <Route exact path='/' component={FeaturesComponent}/>
            <Route exact path='/history' component={HistoryComponent}/>
            <Route exact path='/links' component={LinksComponent}/>
          </Switch>
        </div>
      </div>
    );
  }
}

import * as React from 'react';
import { NavLink } from 'react-router-dom';

import './navigation.component.scss';

export default class NavigationComponent extends React.Component<{}> {
  render() {
    return (
      <div className='tabs'>
        <NavLink exact className='tabs__tab' activeClassName='tab--active' title='Features' to='/'>Features</NavLink>
        <NavLink exact className='tabs__tab' activeClassName='tab--active' title='History' to='/history'>History</NavLink>
        <NavLink exact className='tabs__tab' activeClassName='tab--active' title='Links' to='/links'>Links</NavLink>
        <div className='tabs__version' title={`Extension version v${(window as any).myga.version}`}>v{(window as any).myga.version}</div>
      </div>
    );
  }
}

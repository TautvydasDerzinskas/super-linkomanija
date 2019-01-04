import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';

import './navigation.component.scss';

class NavigationComponent extends React.Component<InjectedIntlProps> {
  render() {
    const { intl } = this.props;

    return (
      <div className='tabs'>
        <NavLink
          exact
          className='tabs__tab'
          activeClassName='tab--active'
          title={intl.formatMessage({ id: 'tabsFeaturesLabel' })}
          to='/'
        >
          <FormattedMessage id='tabsFeaturesLabel'></FormattedMessage>
        </NavLink>
        <NavLink
          exact
          className='tabs__tab'
          activeClassName='tab--active'
          title={intl.formatMessage({ id: 'tabsHistoryLabel' })}
          to='/history'
        >
          <FormattedMessage id='tabsHistoryLabel'></FormattedMessage>
        </NavLink>
        <NavLink
          exact
          className='tabs__tab'
          activeClassName='tab--active'
          title={intl.formatMessage({ id: 'tabsLinksLabel' })}
          to='/links'
        >
          <FormattedMessage id='tabsLinksLabel'></FormattedMessage>
        </NavLink>
        <div
          className='tabs__version'
          title={intl.formatMessage({ id: 'tabsExtensionVersionTitle' })}
        >
            v{(window as any).sl.version}
          </div>
      </div>
    );
  }
}

export default injectIntl(NavigationComponent);

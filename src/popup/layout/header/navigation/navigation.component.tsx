import { NavLink } from 'react-router';
import { FormattedMessage, useIntl } from 'react-intl';

import './navigation.component.scss';

const tabClassName = ({ isActive }: { isActive: boolean }) => 'tabs__tab' + (isActive ? ' tab--active' : '');

export default function NavigationComponent() {
  const intl = useIntl();

  return (
    <div className='tabs'>
      <NavLink
        end
        className={tabClassName}
        title={intl.formatMessage({ id: 'tabsFeaturesLabel' })}
        to='/'
      >
        <FormattedMessage id='tabsFeaturesLabel'></FormattedMessage>
      </NavLink>
      <NavLink
        end
        className={tabClassName}
        title={intl.formatMessage({ id: 'tabsHistoryLabel' })}
        to='/history'
      >
        <FormattedMessage id='tabsHistoryLabel'></FormattedMessage>
      </NavLink>
      <NavLink
        end
        className={tabClassName}
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

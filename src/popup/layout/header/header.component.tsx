

import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { Tooltip } from 'react-tippy';
import Particles from 'react-particles-js';

import { Locales } from '../../../enums';

import NavigationComponent from './navigation/navigation.component';
import LanguagePickerComponent from './language-picker/language-picker.component';

import './header.component.scss';

interface IHeaderComponentProps extends InjectedIntlProps {
  updateLocale: (localeCode: Locales) => void;
}

class HeaderComponent extends React.Component<IHeaderComponentProps> {
  private closePopup() {
    window.close();
  }

  render() {
    const { intl } = this.props;

    return (
      <div className='layout__header'>
        <div className='header__logo'>
          <div className='header__logo__image image--background' style={{ backgroundImage: 'url(./images/header_0.webp)' }}></div>
          <Particles
            className='header__particles'
            width='100%'
            height='100%'
            params={{
              'particles': {
                 'number': {
                    'value': 25,
                    'density': {
                       'enable': true,
                       'value_area': 100
                    }
                 },
                 'color': {
                    'value': '#eb1c24'
                 },
                 'shape': {
                    'type': 'circle',
                    'stroke': {
                       'width': 1,
                       'color': '#000000'
                    },
                    'polygon': {
                       'nb_sides': 5
                    }
                 },
                 'opacity': {
                    'value': 0.7,
                    'random': false,
                    'anim': {
                       'enable': false,
                       'speed': 1,
                       'opacity_min': 0.1,
                       'sync': false
                    }
                 },
                 'size': {
                    'value': 3,
                    'random': true,
                    'anim': {
                       'enable': false,
                       'speed': 40,
                       'size_min': 0.1,
                       'sync': false
                    }
                 },
                 'line_linked': {
                    'enable': true,
                    'distance': 150,
                    'color': '#0079c2',
                    'opacity': 0.4,
                    'width': 1
                 },
                 'move': {
                    'enable': true,
                    'speed': 5,
                    'direction': 'none',
                    'random': true,
                    'straight': false,
                    'out_mode': 'bounce',
                    'bounce': false,
                    'attract': {
                       'enable': false,
                       'rotateX': 600,
                       'rotateY': 1200
                    }
                 }
              },
              'interactivity': {
                 'detect_on': 'canvas',
                 'events': {
                    'onhover': {
                       'enable': true,
                       'mode': 'repulse'
                    },
                    'onclick': {
                       'enable': true,
                       'mode': 'push'
                    },
                    'resize': true
                 },
                 'modes': {
                    'grab': {
                       'distance': 400,
                       'line_linked': {
                          'opacity': 1
                       }
                    },
                    'bubble': {
                       'distance': 400,
                       'size': 40,
                       'duration': 2,
                       'opacity': 8,
                       'speed': 3
                    },
                    'repulse': {
                       'distance': 100,
                       'duration': 0.4
                    },
                    'push': {
                       'particles_nb': 4
                    },
                    'remove': {
                       'particles_nb': 2
                    }
                 }
              },
              'retina_detect': true
           }} />
          <div className='header__logo__image image--logo' style={{ backgroundImage: 'url(./images/header_1.webp)', }}></div>
          <NavigationComponent />
        </div>
        <div
          className='header__close-button'
          onClick={this.closePopup}
        >
          <Tooltip title={intl.formatMessage({ id: 'popupCloseTitle' })} arrow={true} position='bottom'>
            <svg viewBox='0 0 24 24' preserveAspectRatio='xMidYMid meet' focusable='false'>
              <g>
                <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
              </g>
            </svg>
          </Tooltip>
        </div>
        <LanguagePickerComponent updateLocale={this.props.updateLocale}></LanguagePickerComponent>
      </div>
    );
  }
}

export default injectIntl(HeaderComponent);

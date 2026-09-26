import { useIntl } from 'react-intl';
import { Particles, ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine, ISourceOptions } from '@tsparticles/engine';

import { Locales } from '../../../enums';
import Tooltip from '../../shared/tooltip/tooltip.component';

import NavigationComponent from './navigation/navigation.component';
import LanguagePickerComponent from './language-picker/language-picker.component';

import './header.component.scss';

interface IHeaderComponentProps {
  updateLocale: (localeCode: Locales) => void;
}

// Both must be stable references, otherwise particles get re-initialised on every render
const initParticlesEngine = async (engine: Engine) => {
  await loadSlim(engine);
};

const particlesOptions: ISourceOptions = {
  fullScreen: false,
  detectRetina: true,
  particles: {
    number: {
      value: 25,
      density: {
        enable: true,
        width: 400,
        height: 250,
      },
    },
    paint: {
      fill: {
        enable: true,
        color: { value: '#eb1c24' },
      },
      stroke: {
        width: 1,
        color: { value: '#000000' },
      },
    },
    shape: {
      type: 'circle',
    },
    opacity: {
      value: 0.7,
    },
    size: {
      value: { min: 0.1, max: 3 },
    },
    links: {
      enable: true,
      distance: 150,
      color: '#0079c2',
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 5,
      direction: 'none',
      random: true,
      straight: false,
      outModes: 'bounce',
    },
  },
  interactivity: {
    detectsOn: 'canvas',
    events: {
      onHover: {
        enable: true,
        mode: 'repulse',
      },
      onClick: {
        enable: true,
        mode: 'push',
      },
    },
    modes: {
      repulse: {
        distance: 100,
        duration: 0.4,
      },
      push: {
        quantity: 4,
      },
    },
  },
};

const closePopup = () => {
  window.close();
};

export default function HeaderComponent({ updateLocale }: IHeaderComponentProps) {
  const intl = useIntl();

  return (
    <div className='layout__header'>
      <div className='header__logo'>
        <div className='header__logo__image image--background' style={{ backgroundImage: 'url(./images/header_0.webp)' }}></div>
        <ParticlesProvider init={initParticlesEngine}>
          <Particles
            id='header-particles'
            className='header__particles'
            options={particlesOptions} />
        </ParticlesProvider>
        <div className='header__logo__image image--logo' style={{ backgroundImage: 'url(./images/header_1.webp)', }}></div>
        <NavigationComponent />
      </div>
      <div
        className='header__close-button'
        onClick={closePopup}
      >
        <Tooltip title={intl.formatMessage({ id: 'popupCloseTitle' })} position='bottom'>
          <svg viewBox='0 0 24 24' preserveAspectRatio='xMidYMid meet' focusable='false'>
            <g>
              <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
            </g>
          </svg>
        </Tooltip>
      </div>
      <LanguagePickerComponent updateLocale={updateLocale}></LanguagePickerComponent>
    </div>
  );
}

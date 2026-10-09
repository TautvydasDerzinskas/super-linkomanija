import { useIntl } from 'react-intl';

import { IBasicReleaseDetails } from '../../../../../interfaces/release';
import Tooltip from '../../../../shared/tooltip/tooltip.component';

import './release.component.scss';

interface IReleaseComponentProps {
  release: IBasicReleaseDetails;
}

const linkomanijaLink = 'http://www.linkomanija.net/';

export default function ReleaseComponent({ release }: IReleaseComponentProps) {
  const intl = useIntl();

  return (
    <Tooltip title={intl.formatMessage({ id: 'open' })} position='top'>
      <a className='release' target='_blank' href={linkomanijaLink + 'details?' + release.id} title={release.title}>
        <span className='release__category'>
          <img src={'http:' + release.category.imageLink} />
        </span>
        <span className='release__title'>
          {release.title}
        </span>
      </a>
    </Tooltip>
  );
}

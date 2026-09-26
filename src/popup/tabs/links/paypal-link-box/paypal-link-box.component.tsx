import { LinkBoxIcon } from '../link-box/link-box.component';

import './paypal-link-box.component.scss';

interface IPaypalLinkBoxComponentProps {
  position: string;
  icon: string;
  label: string;
}

export default function PaypalLinkBoxComponent({ position, icon, label }: IPaypalLinkBoxComponentProps) {
  return (
    <form className={`link-box link-box--paypal link-box--${position}`} title={label} action='https://www.paypal.com/cgi-bin/webscr' method='post' target='_blank'>
      <input type='hidden' name='cmd' value='_s-xclick' />
      <input type='hidden' name='hosted_button_id' value='WVSZNSW4ZH6ZE' />
      <input type='image' className='original-button' src='https://www.paypalobjects.com/en_GB/i/btn/btn_donate_SM.gif' name='submit' />
      <LinkBoxIcon icon={icon} />
      <button className='link-box__overlay' type='submit'>
        <span>{label}</span>
      </button>
    </form>
  );
}

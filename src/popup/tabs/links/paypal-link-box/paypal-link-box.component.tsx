

import * as React from 'react';

import './paypal-link-box.component.scss';

interface IPaypalLinkBoxComponentProps {
  position: string;
  icon: string;
  label: string;
}

export default class PaypalLinkBoxComponent extends React.Component<IPaypalLinkBoxComponentProps, {}> {
  constructor(props: IPaypalLinkBoxComponentProps) {
    super(props);
  }

  private getIcon() {
    let icon;

    if (this.props.icon.indexOf('.svg') > 0) {
      icon = (
        <svg className='link-box__icon'>
          <use xlinkHref={`vectors/${this.props.icon}#icon`}></use>
        </svg>
      );
    } else {
      icon = (
        <img src={`images/${this.props.icon}`} className='link-box__icon link-box__icon--image' />
      );
    }

    return icon;
  }

  render() {
    return (
      <form className={`link-box link-box--paypal link-box--${this.props.position}`} title={this.props.label} action='https://www.paypal.com/cgi-bin/webscr' method='post' target='_blank'>
        <input type='hidden' name='cmd' value='_s-xclick' />
        <input type='hidden' name='hosted_button_id' value='WVSZNSW4ZH6ZE' />
        <input type='image' className='original-button' src='https://www.paypalobjects.com/en_GB/i/btn/btn_donate_SM.gif' name='submit' />
        {this.getIcon()}
        <button className='link-box__overlay' type='submit'>
          <span>{this.props.label}</span>
        </button>
      </form>
    );
  }
}



import * as React from 'react';

import './link-box.component.scss';

interface ILinkBoxComponentProps {
  link: string;
  position: string;
  icon: string;
  label: string;
}

export default class LinkBoxComponent extends React.Component<ILinkBoxComponentProps, {}> {
  constructor(props: ILinkBoxComponentProps) {
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
      <a href={this.props.link} target='_blank' title={this.props.label} className={`link-box link-box--${this.props.position}`}>
        {this.getIcon()}
        <div className='link-box__overlay'>
          <span>{this.props.label}</span>
        </div>
      </a>
    );
  }
}

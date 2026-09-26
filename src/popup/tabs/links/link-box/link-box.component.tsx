import './link-box.component.scss';

interface ILinkBoxComponentProps {
  link: string;
  position: string;
  icon: string;
  label: string;
}

export function LinkBoxIcon({ icon }: { icon: string }) {
  if (icon.endsWith('.svg')) {
    return (
      <svg className='link-box__icon'>
        <use xlinkHref={`vectors/${icon}#icon`}></use>
      </svg>
    );
  }

  return <img src={`images/${icon}`} className='link-box__icon link-box__icon--image' />;
}

export default function LinkBoxComponent({ link, position, icon, label }: ILinkBoxComponentProps) {
  return (
    <a href={link} target='_blank' title={label} className={`link-box link-box--${position}`}>
      <LinkBoxIcon icon={icon} />
      <div className='link-box__overlay'>
        <span>{label}</span>
      </div>
    </a>
  );
}

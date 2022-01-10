import React, { CSSProperties, ReactNode } from 'react';
import { Variant } from '../../types/baseTypes';
import './button.scss';

type ButtonType = 'submit' | 'button' | 'reset';

type ButtonProps = {
  variant?: Variant;
  outlined?: boolean;
  children?: string | ReactNode;
  icon?: string;
  disabled?: boolean;
  type?: ButtonType;
  style?: CSSProperties;
  onClick?: () => void;
};

const Button = ({
  variant,
  outlined,
  children,
  icon,
  disabled,
  type,
  style,
  onClick,
}: ButtonProps) => {
  const classNames = [
    'button',
    ...(variant ? [`button--${variant}`] : ['button--no-variant']),
    ...(outlined ? ['button--outline'] : ['button--no-outline']),
    ...(children ? ['button--with-children'] : ['button--no-children']),
    ...(icon ? ['button--with-icon'] : ['button--no-icon']),
  ]
    .filter((c) => !!c)
    .join(' ');

  return (
    <button
      type={type || 'button'}
      disabled={disabled || false}
      className={classNames}
      onClick={onClick}
      style={style}
    >
      {icon && <i className="material-icons">{icon}</i>}
      {children}
    </button>
  );
};

export default Button;






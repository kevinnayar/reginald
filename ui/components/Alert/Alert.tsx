import React, { useState } from 'react';
import { Variant, WithKidsProps } from '../../types/baseTypes';
import './alert.scss';

type AlertProps = WithKidsProps & { variant: Variant; dismissable?: boolean };

const Alert = ({ children, variant, dismissable }: AlertProps) => {
  const [dismissing, setDismissing] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const hide = () => {
    setDismissing(true);
    setTimeout(() => setIsDismissed(true), 1000);
  };

  return (
    <div className={`alert alert--${variant} ${dismissing ? 'alert--dismissing' : ''}`}>
      {dismissable && (
        <i className="material-icons" onClick={hide}>
          close
        </i>
      )}
      <div className="alert__inner">{children}</div>
    </div>
  );
};

export default Alert;


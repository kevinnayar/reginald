import React from 'react';
import { WithKidsProps } from '../../types/baseTypes';
import './card.scss';

const Card = ({ children }: WithKidsProps) => (
  <div className="card">
    <div className="card__inner">{children}</div>
  </div>
);

export default Card;

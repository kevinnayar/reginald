import React from 'react';
import { WithKidsProps } from '../../types/baseTypes';
import './cards.scss';

type CardsProps = WithKidsProps & { numCards: 1 | 2 | 3 | 4 };

const Cards = ({ children, numCards }: CardsProps) => (
  <div className={`cards cards--num-${numCards}`}>{children}</div>
);

export default Cards;



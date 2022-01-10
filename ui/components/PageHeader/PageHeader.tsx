import React from 'react';
import { WithKidsProps } from '../../types/baseTypes';
import './page-header.scss';

const PageHeader = ({ children }: WithKidsProps) => (
  <header className="page--header">
    <div className="inner">{children}</div>
  </header>
);

export default PageHeader;

import React from 'react';
import { WithKidsProps } from '../../types/baseTypes';
import './page-content.scss';

const PageContent = ({ children }: WithKidsProps) => (
  <main className="page--content">
    <div className="inner">{children}</div>
  </main>
);

export default PageContent;

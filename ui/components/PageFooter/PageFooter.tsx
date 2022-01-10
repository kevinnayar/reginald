import React from 'react';
import { WithKidsProps } from '../../types/baseTypes';
import './page-footer.scss';

const PageFooter = ({ children }: WithKidsProps) => (
  <footer className="page--footer">
    <div className="inner">{children}</div>
  </footer>
);

export default PageFooter;

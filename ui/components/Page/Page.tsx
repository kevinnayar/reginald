import React from 'react';
import { WithKidsProps } from '../../types/baseTypes';
import './page.scss';

type PageProps = WithKidsProps & { fullWidth?: boolean };

const Page = ({ children, fullWidth }: PageProps) => (
  <div className={`page ${fullWidth ? 'page--full-width' : ''}`}>{children}</div>
);

export default Page;

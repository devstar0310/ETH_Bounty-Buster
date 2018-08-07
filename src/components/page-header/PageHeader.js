import React from 'react';

import './PageHeader.css';

const PageHeader = ({ title, right }) => {
  return (
    <div className='PageHeader'>
      <p className='PageHeaderTitle'>{title}</p>
      {right || null}
    </div>
  );
};

export default PageHeader;

import React, { Children } from 'react';

import './DashboardSection.css';

const DashboardSection = ({ title, children }) => {
  return (
    <div>
      <p>{title}</p>
      <div className='DashboardSectionContainer'>
        {Children.only(children)}
      </div>
    </div>
  );
};

export default DashboardSection;

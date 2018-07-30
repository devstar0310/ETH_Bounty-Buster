import React from 'react';

import CustomButton from '../components/button/CustomButton';
import './SideBarContainer.css';

const SideBarContainer = () => {
  return (
    <div className='SideBarContainer'>
      <CustomButton iconName='home' />
      <CustomButton iconName='list' />
    </div>
  );
}

export default SideBarContainer;

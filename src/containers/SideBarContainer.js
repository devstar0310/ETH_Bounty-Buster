import React from 'react';
import { withRouter } from 'react-router';

import CustomButton from '../components/button/CustomButton';
import './SideBarContainer.css';

const SideBarContainer = ({ history }) => {
  return (
    <div className='SideBarContainer'>
      <div className='SideBarLinks'>
        <CustomButton iconName='home' onClick={() => history.push('/dashboard')} />
        <CustomButton iconName='list' onClick={() => history.push('/tasks')} />
      </div>
    </div>
  );
}

export default withRouter(SideBarContainer);

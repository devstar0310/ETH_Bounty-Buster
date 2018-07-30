import React, { Component } from 'react';

import './DashboardContainer.css';

class DashboardContainer extends Component {
  render() {
    return (
      <div className='DashboardContainer'>
        <div>Posted Tasks</div>
        <div>My Opened Tasks</div>
      </div>
    );
  }
}

export default DashboardContainer;

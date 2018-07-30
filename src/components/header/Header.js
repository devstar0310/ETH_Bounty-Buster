import React from 'react';

import './Header.css';

const Header = ({ title }) => {
  return (
    <div className='HeaderContainer'>
      <div className='HeaderTitle'>{title}</div>
    </div>
  );
}

export default Header;

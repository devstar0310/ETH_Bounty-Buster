import React from 'react';
import { Redirect } from 'react-router-dom';

const HomeContainer = () => {
  return (
    <Redirect to='/tasks' />
  );
}

export default HomeContainer;

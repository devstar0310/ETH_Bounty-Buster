import React from 'react';
import Paper from '@material-ui/core/Paper';

import './PaperSection.css';

const PaperSection = ({ children }) => {
  return (
    <Paper className='PaperSectionContainer'>
      {children}
    </Paper>
  );
};

export default PaperSection;

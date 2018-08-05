import React from 'react';

import './ModalForm.css';

const ModalForm = ({ children }) => {
  return (
    <form className='ModalForm'>{children}</form>
  );
}

export default ModalForm;

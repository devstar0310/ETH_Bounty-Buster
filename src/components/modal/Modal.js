import React from 'react';
import CustomButton from '../button/CustomButton';

import './Modal.css';

const Modal = ({ children, onClose }) => {
  return (
    <div className='ModalBackground'>
      <div className='ModalContainer'>
        <div className='ModalCloseButton'>
          <CustomButton onClick={onClose} iconName='close' />
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;

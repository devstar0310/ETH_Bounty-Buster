import React from 'react';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

const CustomButton = ({ onClick, iconName, value, ...props }) => {
  return (
    <Button onClick={onClick} {...props}>
      {value ? value : null}
      {iconName ? <Icon>{iconName}</Icon> : null}
    </Button>
  );
}

export default CustomButton;

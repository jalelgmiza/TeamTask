import React from 'react';
import { Button as MuiButton } from '@mui/material';

const Button = ({ children, onClick, type = 'button', disabled, variant = 'contained', color = 'primary', ...props }) => {
  return (
    <MuiButton
      type={type}
      onClick={onClick}
      disabled={disabled}
      variant={variant}
      color={color}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
import React from 'react';
import { TextField } from '@mui/material';

const Input = ({ type, value, onChange, placeholder, required, label, multiline, rows, ...props }) => {
  return (
    <TextField
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      label={label}
      multiline={multiline}
      rows={rows}
      fullWidth
      variant="outlined"
      {...props}
    />
  );
};

export default Input;
import React, { forwardRef } from 'react';
import { TextField, type TextFieldProps } from '@mui/material';

export interface EmailInputProps extends Omit<TextFieldProps, 'type'> {
  error?: boolean;
  helperText?: string;
}

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  ({ error, helperText, ...props }, ref) => {
    return (
      <TextField
        {...props}
        ref={ref}
        type="email"
        label="Email"
        variant="outlined"
        fullWidth
        error={error}
        helperText={helperText}
        autoComplete="email"
        inputProps={{
          'data-testid': 'email-input',
          ...props.inputProps,
        }}
      />
    );
  }
);

EmailInput.displayName = 'EmailInput';
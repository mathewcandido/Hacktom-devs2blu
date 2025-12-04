import React, { forwardRef, useState } from 'react';
import { 
  TextField, 
  IconButton, 
  InputAdornment, 
  type TextFieldProps 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export interface PasswordInputProps extends Omit<TextFieldProps, 'type'> {
  error?: boolean;
  helperText?: string;
  showToggle?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ error, helperText, showToggle = true, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
      setShowPassword(!showPassword);
    };

    return (
      <TextField
        {...props}
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        label="Senha"
        variant="outlined"
        fullWidth
        error={error}
        helperText={helperText}
        autoComplete="current-password"
        InputProps={{
          endAdornment: showToggle && (
            <InputAdornment position="end">
              <IconButton
                onClick={handleTogglePassword}
                edge="end"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                data-testid="password-toggle"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
          ...props.InputProps,
        }}
        inputProps={{
          'data-testid': 'password-input',
          ...props.inputProps,
        }}
      />
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
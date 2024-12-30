import { Box, FormHelperText } from '@mui/material';
import { StyledOutlinedInput, StyledFormControl } from './TextField.Styled';
import { FieldLabel } from '../FieldLabel/FieldLabel';
import { CSSProperties } from 'react';

export interface TextFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  name?: string;
  label?: string;
  required?: boolean;
  value?: unknown;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorMsg?: string;
  disabled?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  button?: React.ReactNode;
  type?: string;
  style?: CSSProperties | undefined;
}

export const TextField: React.FC<TextFieldProps> = (props: TextFieldProps) => {
  const {
    id,
    name,
    label,
    required,
    value,
    handleChange,
    error,
    errorMsg,
    disabled,
    startAdornment,
    placeholder,
    type,
    style,
  } = props;
  return (
    <StyledFormControl error={error}>
      <Box>{label ? <FieldLabel id={`${id}Label`} label={label} required={required} /> : ''}</Box>
      <StyledOutlinedInput
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        error={error}
        disabled={disabled}
        startAdornment={startAdornment}
        placeholder={placeholder}
        fullWidth
        type={type}
        style={style}
      />
      <FormHelperText>{errorMsg ? errorMsg : ' '}</FormHelperText>
    </StyledFormControl>
  );
};

import { OutlinedInput, OutlinedInputProps, styled, FormControl, FormControlProps } from '@mui/material';

export const StyledOutlinedInput = styled(OutlinedInput)<OutlinedInputProps>(() => ({
  height: '46px',
  padding: '12px, 16px',
  borderRadius: '8px',
  border: '1px',
  gap: '2px',
  background: '#fff',
  '& .MuiOutlinedInput-input': {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '22.4px',
    letterSpacing: '0em',
    textAlign: 'left',
    color: '#000',
  },
  '& .Mui-disabled': {
    padding: '12px',
    borderRadius: '8px',
    background: 'linear-gradient(0deg, #F3F4F6, #F3F4F6),linear-gradient(0deg, #F3F4F6, #F3F4F6)',
    color: '#6B7280',
    fontWeight: 400,
  },
  '& .MuiInputBase-input::placeholder': {
    fontSize: 14,
    fontWeight: 400,
    lineHeight: '22px',
    letterSpacing: '0em',
    textAlign: 'left',
    color: '#646B78',
  },
}));

export const StyledFormControl = styled(FormControl)<FormControlProps>(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
}));

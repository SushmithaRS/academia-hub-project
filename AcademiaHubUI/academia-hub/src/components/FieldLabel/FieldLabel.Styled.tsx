import { FormLabel, FormLabelProps, Typography, TypographyProps, styled } from '@mui/material';

export const StyledFormLabel = styled(FormLabel)<FormLabelProps>(() => ({
  fontSize: '14px',
  lineHeight: '22px',
  letterSpacing: '0em',
  textAlign: 'left',
  color: '#000000',
  fontWeight: 400,
  '& .MuiFormLabel-asterisk': {
    color: '#F12424',
    marginLeft: '-7px',
  },
}));

export const StyledOptionalText = styled(Typography)<TypographyProps>(() => ({
  color: '#6B7280',
  lineHeight: '22.40px',
  wordWrap: 'break-word',
}));

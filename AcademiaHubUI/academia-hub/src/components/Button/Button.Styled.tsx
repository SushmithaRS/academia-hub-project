import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

export const StyledButton = styled(Button)(({ theme, size, fullWidth }) => ({
  // Define CSS properties for the button
  borderRadius: '8px',
  padding: '12px, 16px, 12px, 16px',
  fontSize: '14px',
  fontWeight: 700,
  lineHeight: '22px',
  letterSpacing: '0em',
  textAlign: 'center',
  width: fullWidth ? '100%' : 'auto',
  textTransform: 'none',
  height: '46px',

  // Define styles for the primary variants

  '&.MuiButton-primaryPrimary': {
    color: '#FFFFFF',
    backgroundColor: theme.palette.primary.main,
    // backgroundColor: "#46BB90",
  },
  '&.MuiButton-primaryPrimary:hover': {
    backgroundColor: '#379573',
  },

  '&.MuiButton-primaryPrimary:disabled': {
    backgroundColor: '#D1D5DB',
    color: '#FFFFFF',
  },

  // Define styles for the secondary variants

  '&.MuiButton-secondaryPrimary': {
    color: '#000',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    fontWeight: 400,
  },
  '&.MuiButton-secondaryPrimary:hover': {
    backgroundColor: '#E5E7EB',
  },

  '&.MuiButton-secondaryPrimary:disabled': {
    backgroundColor: '#FFFFFF',
    color: '#D1D5DB',
    border: '1px solid #E5E7EB',
    fontWeight: 400,
  },

  // Define styles for the ghost/tertiary variants

  '&.MuiButton-ghostPrimary': {
    color: '#000',
    backgroundColor: '#FFFFFF',
  },

  '&.MuiButton-ghostPrimary:hover': {
    color: '#374151',
  },

  '&.MuiButton-ghostPrimary:disabled': {
    backgroundColor: '#FFFFFF',
    color: '#D1D5DB',
  },

  // Apply size-specific styles

  ...(size === 'small' && {
    fontSize: '12px',
    height: '30px',
    width: '30px',
  }),

  ...(size === 'medium' &&
    {
      // fontSize: "14px",
    }),

  ...(size === 'large' && {
    // fontSize: "14px",
    width: '438px',
    height: '46px',
  }),
}));

export default StyledButton;

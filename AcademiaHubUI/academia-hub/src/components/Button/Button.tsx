// import { Button as MUIButton } from "@mui/material";
import StyledButton from './Button.Styled';

export interface ButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  text: string;
  disabled: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'disabled' | 'ghost';
  type?: 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const { id, text, disabled, startIcon, endIcon, size, variant, onClick, fullWidth, type } = props;
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  return (
    <StyledButton
      id={id}
      disabled={disabled}
      fullWidth={fullWidth}
      startIcon={startIcon}
      endIcon={endIcon}
      size={size}
      type={type}
      variant={variant}
      onClick={handleClick}
    >
      {text}
    </StyledButton>
  );
};

export default Button;

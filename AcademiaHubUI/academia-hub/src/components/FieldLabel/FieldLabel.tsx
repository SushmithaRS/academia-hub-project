import { StyledFormLabel, StyledOptionalText } from "./FieldLabel.Styled";

export interface FieldLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  label: string;
  required?: boolean;
  optionalText?: string;
}

export const FieldLabel: React.FC<FieldLabelProps> = (props: FieldLabelProps) => {
  const { id, label, required, optionalText } = props;
  return (
    <>
      <StyledFormLabel
        htmlFor={id}
        required={required}
      >{label} {props?.optionalText !== "" ? <StyledOptionalText component={"span"}>{optionalText}</StyledOptionalText> : ""}
      </StyledFormLabel>

    </>


  )
}
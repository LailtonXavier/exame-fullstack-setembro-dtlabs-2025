import { StyledButton } from './styled';

interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const Button = ({ isLoading, children, ...props }: SubmitButtonProps) => {
  return (
    <StyledButton {...props} disabled={props.disabled || isLoading}>
      {isLoading ? "Carregando..." : children}
    </StyledButton>
  );
};
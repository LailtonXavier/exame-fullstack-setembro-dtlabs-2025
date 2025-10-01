import { StyledButton } from './styled';

interface SubmitButtonLinkProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const ButtonLink = ({ children, ...props }: SubmitButtonLinkProps) => {
  return (
    <StyledButton {...props}>
      {children}
    </StyledButton>
  );
};
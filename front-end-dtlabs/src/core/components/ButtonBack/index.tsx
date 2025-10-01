import { ArrowLeft } from 'lucide-react';
import { StyledButtonBack } from './styled';
import { theme } from '@/styles/theme';

export const ButtonBack = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <StyledButtonBack {...props}>
      <ArrowLeft color={theme.colors.greenLight} />
      {children}
    </StyledButtonBack>
  );
};
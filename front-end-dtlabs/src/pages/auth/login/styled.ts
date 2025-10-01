import { theme } from '@/styles/theme';
import styled from 'styled-components';

export const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const LoginCard = styled.div`
  background: ${theme.colors.primary2};
  padding: 48px;
  border-radius: 12px;
  border: 1px solid ${theme.colors.borderColor};
  width: 100%;
  max-width: 548px;
`;

export const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.lg};
`;

export const LoginSubtitleSmall = styled.h2`
  font-size: 16px;
  font-weight: 500;
  color: ${theme.colors.subtitle};
  margin: ${theme.spacing.xs};
  text-align: center;
`;

export const LoginSubtitle = styled.h2`
  font-size: 18px;
  font-weight: 900;
  color: ${theme.colors.subtitle};
  margin-bottom: ${theme.spacing.xs};
  text-align: center;
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FormGroups = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.white};
  margin-bottom: 6px;
`;

export const FormInput = styled.input`
  padding: 12px;
  border: 1px solid ${theme.colors.borderColor};
  border-radius: 6px;
  font-size: 14px;
  background: ${theme.colors.primary2};
  transition: border-color 0.2s;
  color: ${theme.colors.subtitle};

  &:focus {
    outline: none;
    border-color:${theme.colors.focus};
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: ${theme.colors.subtitle};
  }
`;

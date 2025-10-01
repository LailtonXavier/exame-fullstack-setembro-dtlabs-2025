import { theme } from '@/styles/theme';
import styled from 'styled-components';

export const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LogoContainerIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
  padding: 10px;
  border-radius: 8px;
  background: ${theme.colors.greenIconDark};
`;

export const LoginTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  text-align: center;

  @media (max-width: 720px) {
    font-size: 18px;
  }

  @media (max-width: 400px) {
    display: none;
  }
`;
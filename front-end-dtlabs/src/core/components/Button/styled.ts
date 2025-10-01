import styled from "styled-components";
import { theme } from '@/styles/theme';

export const StyledButton = styled.button`
  background: ${theme.colors.greenLight};
  color: ${theme.colors.primary};
  border: none;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;

  &:hover {
    transform: translateY(-1px);
    opacity: 0.95;
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
  }
`;
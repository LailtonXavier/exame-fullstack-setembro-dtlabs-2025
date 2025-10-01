import styled from "styled-components";
import { theme } from '@/styles/theme';

export const StyledButtonBack = styled.button`
  background: ${theme.colors.gray900};
  color: ${theme.colors.greenLight};
  border: none;
  border-bottom: 2px solid ${theme.colors.greenLight};
  padding: 5px 10px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
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
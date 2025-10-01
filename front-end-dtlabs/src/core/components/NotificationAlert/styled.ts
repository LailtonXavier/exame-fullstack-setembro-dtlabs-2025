import { theme } from '@/styles/theme';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

export const ModalContainer = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  background: #1f2937; 
  border-left: 4px solid ${theme.colors.greenLight};
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.35);
  color: #fff;
  z-index: 9999;
  min-width: 260px;
  animation: ${slideIn} 0.3s ease;
`;

export const Title = styled.p`
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 6px;
  color: ${theme.colors.greenLight};
`;

export const Info = styled.p`
  font-size: 14px;
  color: #d1d5db;
  margin: 2px 0;
`;

export const Button = styled.button`
  margin-top: 10px;
  padding: 6px 12px;
  background: ${theme.colors.greenIcon};
  color: #fff;
  font-size: 13px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: ${theme.colors.greenIconDark};
  }
`;
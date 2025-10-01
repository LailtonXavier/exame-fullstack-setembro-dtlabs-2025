import { theme } from '@/styles/theme';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;


export const DeviceModalContainer = styled.div `
  width: 400px;
  animation: ${slideIn} 0.3s ease-out;
  color: white;
  margin: 0 auto;
  margin-top: 80px;
`

export const DeviceModalCard = styled.div`
  background: ${theme.colors.primary2};
  padding: 48px;
  border-radius: 12px;
  border: 1px solid ${theme.colors.borderColor};
  width: 100%;
  max-width: 548px;
  margin-top: 16px;
`;

export const DeviceModalSubtitle = styled.h2`
  font-size: 18px;
  font-weight: 900;
  color: ${theme.colors.subtitle};
  margin-bottom: ${theme.spacing.xs};
  text-align: center;
`;

export const DeviceModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FormGroup = styled.div`
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

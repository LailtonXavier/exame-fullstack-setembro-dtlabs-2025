import { theme } from '@/styles/theme';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

interface SwitchButtonProps {
  connectivity: boolean
}

export const HeartbeatModalContainer = styled.div `
  animation: ${slideIn} 0.3s ease-out;
  color: white;
  margin: 0 auto;
`

export const HeartbeatModalCard = styled.div`
  background: ${theme.colors.primary2};
  padding: 48px;
  border-radius: 12px;
  border: 1px solid ${theme.colors.borderColor};
  width: 100%;
  max-width: 548px;
  margin-top: 16px;
`;

export const HeartbeatModalSubtitle = styled.h2`
  font-size: 18px;
  font-weight: 900;
  color: ${theme.colors.subtitle};
  margin-bottom: ${theme.spacing.xs};
  text-align: center;
`;

export const HeartbeatModalForm = styled.form`
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

export const FormGroupContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

export const SwitchButton = styled.div<SwitchButtonProps>`
  width: 60px;
  height: 32px;
  border-radius: 16px;
  background: ${(props => props.connectivity ? '#22c55e' : '#d1d5db')};
  display: flex;
  align-items: center;
  padding: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
`

export const SwitchButtonElement = styled.div<SwitchButtonProps>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  transform: ${(props => props.connectivity ? 'translateX(28px)' : 'translateX(0)')};
  transition: transform 0.3s ease;
`
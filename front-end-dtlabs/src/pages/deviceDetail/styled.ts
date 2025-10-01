import { theme } from '@/styles/theme';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const DeviceDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 1100px;
  gap: 20px;
  padding: 20px 0;
  animation: ${slideIn} 0.3s ease-out;
  transition: all 0.3s ease;
  margin: 0 auto;
  margin-top: 80px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const HeaderDetail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  background-color: ${theme.colors.gray900};
  padding: 10px;
  border-radius: 10px;

  h2 {
    text-transform: capitalize;
  }
`

export const DeviceContentMain = styled.div`
  cursor: pointer;
  background-color: ${theme.colors.gray900};
  padding: 10px;
  border-radius: 10px;
  animation: ${slideIn} 0.3s ease-out;
  transition: all 0.3s ease;

  .subDiv {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3, p {
    color: white;
  }
  }
`

export const DeleteHeartbeatIcon = styled.button`
  border: 1px solid red;
  color:rgb(255, 255, 255);
  background-color: rgba(223, 104, 104, 0.73);
  border-radius: 16px;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  gap: 4px;
`

export const FilterHeartbeatForm = styled.form`
  display: flex;
  gap: 20px;
  margin-right: 16px;
`;

export const FormFilterHeartbeat = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.white};
`;


export const FormInput = styled.input`
  padding: 12px;
  border: 1px solid ${theme.colors.borderColor};
  border-radius: 6px;
  font-size: 14px;
  background: ${theme.colors.primary3};
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
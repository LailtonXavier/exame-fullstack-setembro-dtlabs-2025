import { theme } from '@/styles/theme';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const NotificationContainer = styled.div`
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
`;

export const NotificationContent = styled.div`
  cursor: pointer;
  padding: 10px;
  background-color: ${theme.colors.gray900};
  border-radius: 10px;
  animation: ${slideIn} 0.3s ease-out;
  transition: all 0.3s ease;
  color: rgba(231, 231, 231, 0.6);
  width: 340px;

  strong {
    color: white;
  }
`

export const NotificationContentMain = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: start;
  justify-content: center;
  gap: 20px;

  color: rgba(231, 231, 231, 0.6);

  strong {
    color: white;
  }
`

export const ContainerIconsNotification = styled.button`
  border: none;
  background: ${theme.colors.greenLight};
  padding: 5px 7px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 720px) {
    font-size: 12px;
    padding: 4px 6px;
  }
`;

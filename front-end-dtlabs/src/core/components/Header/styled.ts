import { theme } from '@/styles/theme';
import styled from 'styled-components';

export const ContainerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  position: fixed;
  top: 0;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 99;
  cursor: pointer;
`;

export const ContainerIconsHeader = styled.button`
  border: none;
  background: ${theme.colors.greenLight};
  padding: 5px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 8px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 720px) {
    font-size: 12px;
    padding: 4px 6px;
  }
`;

export const ContainerMessage = styled.button`
  background: rgb(223, 75, 75);
  color: white;
`
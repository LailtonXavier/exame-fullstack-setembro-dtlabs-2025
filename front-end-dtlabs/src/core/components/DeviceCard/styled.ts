import styled, { keyframes } from 'styled-components';
import { AlertIndicatorProps, CardContainerProps, ProgressFillProps, StatusBadgeProps } from './types';
import { theme } from '@/styles/theme';

const pulseAlert = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const CardContainer = styled.div<CardContainerProps>`
  width: 340px;
  background: ${theme.colors.gray900};
  border-radius: 16px;
  padding: 20px;
  border-top: 4px solid ${props => props.hasAlerts ? '#fecaca' : '#e5e7eb'};
  animation: ${slideIn} 0.3s ease-out;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

export const DeviceName = styled.button`
  font-size: 18px;
  font-weight: 700;
  color:rgb(255, 255, 255);
  margin: 0 0 4px 0;
  gap: 8px;
  transition: all 0.5s;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  text-transform: capitalize;

  &:hover {
    color: ${theme.colors.info};
  }
`;

export const DeviceDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
`;

export const LocationInfo = styled.div`
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 8px;
  padding: 6px 10px;
  background:rgba(39, 126, 212, 0.39);
  border-radius: 6px;
`;

export const HeartbeatInfo = styled.div`
  font-size: 11px;
  color: #65a30d;
  background: #f0fdf4;
  padding: 4px 8px;
  border-radius: 4px;
  margin-bottom: 16px;
  border-left: 2px solid #22c55e;
`;

export const CardContent = styled.div`
  margin: 16px 0;
`;

export const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;

  @media (min-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
`;

export const MetricSection = styled.div``;

export const MetricItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${theme.colors.gray800};
  border-radius: 12px;
  position: relative;
  min-height: 80px;

  @media (max-width: 720px) {
    margin-bottom: 8px;
  }
`;

export const MetricIcon = styled.div`
  font-size: 20px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
  margin-left: 8px;
`;

export const MetricInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const MetricName = styled.div`
  font-size: 12px;
  font-weight: 600;
  color:rgb(231, 231, 231);
  margin-bottom: 2px;
`;

export const MetricValue = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: rgba(231, 231, 231, 0.6);
  margin-bottom: 6px;
`;

export const ProgressBar = styled.div`
  width: 90%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
`;

export const ProgressFill = styled.div<ProgressFillProps>`
  height: 100%;
  width: ${props => props.width}%;
  background: ${props => props.color};
  border-radius: 2px;
  transition: all 0.3s ease;
  box-shadow: 0 0 6px ${props => `${props.color}40`};
`;

export const AlertIndicator = styled.span<AlertIndicatorProps>`
  color: #ef4444;
  font-size: ${props => props.small ? '14px' : '18px'};
  animation: ${pulseAlert} 2s ease-in-out infinite;
  flex-shrink: 0;
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
  flex-wrap: wrap;
  gap: 10px;
`;

export const LastUpdate = styled.div`
  font-size: 11px;
  color: #9ca3af;
  font-weight: 500;
`;

export const StatusBadge = styled.span<StatusBadgeProps>`
  padding: 4px 10px;
  background: ${props => props.isOnline ? '#dcfce7' : '#fef2f2'};
  color: ${props => props.isOnline ? '#166534' : '#dc2626'};
  border-radius: 16px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid ${props => props.isOnline ? '#bbf7d0' : '#fecaca'};
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ContainerIconsOpen = styled.div`
  display: flex;
  justify-content: space-around;
  background-color: transparent;
  border: none;
  margin-bottom: 16px;
`

export const ContainerIcons = styled.button`
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 8px;
  background-color: transparent;
  border: none;
  cursor: pointer;

  :hover{
    transform: scale(1.2);
  }
`

export const GridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 1100px;
  gap: 20px;
  padding: 20px 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;

  .empty-icon {
    font-size: 64px;
    margin-bottom: 16px;
  }

  h3 {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: #374151;
  }

  p {
    font-size: 14px;
    margin: 0;
  }
`;

export const Readings = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

export const AlertIcon = styled.span`
  font-size: 12px;
  color: #ef4444;
  font-weight: 500;
`;

export const SeeMore = styled.button`
  color:rgba(253, 253, 253, 0.75);
  border: none;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  margin-top: 8px;
  cursor: pointer;
`;

export const SeeMoreComponentAbs = styled.div`
  width: 100%;
  position: absolute;
  bottom: 20px;
  left: 0;

  @media (max-width: 768px) {
    bottom: 0px;
  }
`
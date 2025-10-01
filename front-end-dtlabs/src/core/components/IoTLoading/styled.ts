import styled, { keyframes } from 'styled-components';

const wave = keyframes`
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(4); opacity: 0; }
`;

const progress = keyframes`
  0% { width: 0%; }
  100% { width: 100%; }
`;

export const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const LoadingCard = styled.div`
  padding: 40px 30px;
  border-radius: 20px;
  text-align: center;
  min-width: 300px;
`;

export const IoTIcon = styled.div`
  margin-bottom: 0px;
  
  .iot-symbol {
    position: relative;
    width: 80px;
    height: 80px;
    margin: 0 auto;
    
    .wave {
      position: absolute;
      width: 80px;
      height: 80px;
      border: 2px solid #22c55e;
      border-radius: 50%;
      animation: ${wave} 2s linear infinite;
      
      &.delay-1 {
        animation-delay: 0.7s;
      }
      
      &.delay-2 {
        animation-delay: 1.4s;
      }
    }
  }
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: #dcfce7;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 100px;
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #22c55e, #16a34a);
    border-radius: 3px;
    animation: ${progress} 2s ease-in-out infinite;
  }
`;

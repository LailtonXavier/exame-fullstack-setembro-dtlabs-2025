import React from 'react';
import {
  LoadingContainer,
  LoadingCard,
  IoTIcon,
  ProgressBar,
} from './styled';

const IoTLoading = () => {
  return (
    <LoadingContainer>
      <LoadingCard>
        <IoTIcon>
          <div className="iot-symbol">
            <div className="wave"></div>
            <div className="wave delay-1"></div>
            <div className="wave delay-2"></div>
          </div>
        </IoTIcon>
        <ProgressBar>
          <div className="progress-fill"></div>
        </ProgressBar>
      </LoadingCard>
    </LoadingContainer>
  );
};

export default IoTLoading;
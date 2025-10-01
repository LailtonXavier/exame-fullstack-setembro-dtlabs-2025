import { User } from '@/core/domain/entities/user';
import React from 'react';
import DeviceCard from '../DeviceCard';
import DeviceEmpty from '../DeviceCard/components/DeviceEmpty';
import { GridContainer } from '../DeviceCard/styled';

interface DevicesGridProps {
  userData?: User | null;
}

const DevicesGrid: React.FC<DevicesGridProps> = ({ userData }) => {
  if (!userData?.devices || userData.devices.length === 0) {
    return (
      <DeviceEmpty />
    );
  }

  return (
    <GridContainer>
      {userData.devices.map((device) => (
        <DeviceCard
          key={device.uuid}
          device={device}
        />
      ))}
    </GridContainer>
  );
};

export default DevicesGrid;
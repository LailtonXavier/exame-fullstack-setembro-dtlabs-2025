import { Edit3, Ellipsis, LoaderIcon, Trash } from 'lucide-react';
import { useState } from 'react';
import { AlertIndicator, CardHeader, ContainerIcons, ContainerIconsOpen, DeviceDescription, DeviceName, StatusBadge } from '../styled';
import { theme } from '@/styles/theme';
import { useUiStore } from '@/core/infra/store/uiStore';
import { Device } from '@/core/domain/entities/device';
import { useDeleteDevice } from '@/hooks/useDeleteDevice';
import { useNavigate } from 'react-router-dom';

interface DeviceHeaderProps {
  isOnline: boolean;
  hasAlerts: boolean;
  name: string;
  description: string | null;
  device: Device;
}

const DeviceHeader = ({description, name, hasAlerts , isOnline, device}: DeviceHeaderProps) => {
  const navigate = useNavigate()

  const [showButtons, setShowButtons] = useState(false);
  const { openDeviceModal } = useUiStore();
  const { mutate: deleteDevice, isPending } = useDeleteDevice();
  
  const toggleShowButtons = () => {
    setShowButtons((prev) => !prev);
  };

  const handleDelete = () => {
    deleteDevice(device.uuid)
    toggleShowButtons()
  }

  if(showButtons) {
    return (
      <ContainerIconsOpen>
        <ContainerIcons onClick={() => openDeviceModal(device)}>
          <Edit3 color='white' />
        </ContainerIcons>
        <ContainerIcons>
          {isPending ? 
            <LoaderIcon color="#911111" /> : 
            <Trash color="#911111" onClick={handleDelete} /> }
        </ContainerIcons>
        <ContainerIcons onClick={toggleShowButtons}>
          <p style={{ color: theme.colors.greenLight, fontSize: '24px'}}>X</p>
        </ContainerIcons>
      </ContainerIconsOpen>
    )
  }

  return (
    <CardHeader>
      <div>
        <DeviceName onClick={() => navigate(`/devices/${device.uuid}`)}>
          {name}
          {hasAlerts && <AlertIndicator>⚠️</AlertIndicator>}
        </DeviceName>
        <DeviceDescription>{description}</DeviceDescription>
      </div>
      <div style={{ display: 'flex'}}>
        <StatusBadge isOnline={isOnline}>
          {isOnline ? 'Online' : 'Offline'}
        </StatusBadge>
        
        <ContainerIcons onClick={toggleShowButtons}>
          <Ellipsis color="white" />
        </ContainerIcons>
      </div>
    </CardHeader>
  );
}

export default DeviceHeader;



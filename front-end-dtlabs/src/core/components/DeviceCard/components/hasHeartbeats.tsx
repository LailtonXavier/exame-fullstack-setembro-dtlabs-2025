import { Device } from '@/core/domain/entities/device';
import { CardContainer, LocationInfo, SeeMoreComponentAbs } from '../styled';
import DeviceHeader from './DeviceHeader';
import SeeMoreComponent from './SeeMore';

interface HasHeartbeatsProps {
  hasAlerts: boolean;
  isOnline: boolean;
  name: string;
  description: string | null;
  location: string;
  sn: string;
  device: Device;
}

const HasHeartbeats = ({description, hasAlerts, location, name, sn, isOnline, device}: HasHeartbeatsProps) => {
  return (
    <CardContainer hasAlerts={hasAlerts}>
      <DeviceHeader 
        description={description}
        hasAlerts={hasAlerts}
        isOnline={isOnline}
        name={name}
        device={device} 
      />
      <LocationInfo>
        📍 {location} | SN: {sn}
      </LocationInfo>
      <div style={{ marginBottom: '20px', marginTop: '10px', textAlign: 'center', color: '#6b7280'}}>
        ⚠️ Aguardando primeiro heartbeat...
      </div>

      <SeeMoreComponentAbs>
        <SeeMoreComponent deviceId={device.uuid} />
      </SeeMoreComponentAbs>
    </CardContainer>
  );
}

export default HasHeartbeats;



import { useEffect, useState } from 'react';
import DeviceModal from './core/components/DeviceModal';
import Header from './core/components/Header';
import NotificationAlert from './core/components/NotificationAlert';
import Starfield from './core/components/Starfield';
import { AuthInitializer } from './core/infra/store/authInitializer';
import { useUiStore } from './core/infra/store/uiStore';
import { AppRoutes } from "./routes/AppRoutes";
import { tokenStore } from './core/infra/store/tokenStore';

function App() {
  const { deviceModal, closeDeviceModal } = useUiStore();
  const [tokenState, setTokenState] = useState<string | null>();

  useEffect(() => {
    const getToken = async () => {
      const token = await tokenStore.getAccessToken();
      setTokenState(token)
    }
    getToken()
  }, [])

  return (
    <AuthInitializer>
       <Starfield count={120} />
       {tokenState && <NotificationAlert token={tokenState} />}
       <Header />
       {deviceModal ? <DeviceModal onClose={closeDeviceModal} />
       : <AppRoutes />}      
    </AuthInitializer>
  );
}

export default App;

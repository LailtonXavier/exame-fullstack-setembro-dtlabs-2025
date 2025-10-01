import { useAuthStore } from '@/core/infra/store/authStore';
import { tokenStore } from '@/core/infra/store/tokenStore';
import { useUiStore } from '@/core/infra/store/uiStore';
import { theme } from '@/styles/theme';
import { LogOut, MessageSquare, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../Logo';
import { ContainerHeader, ContainerIconsHeader } from './styled';

const Header = () => {
  const {user} = useAuthStore()
  const navegate = useNavigate()
  const { openDeviceModal } = useUiStore();

  const handeGoToNotifications = () => {
    navegate('/notifications')
  }

  const handeGoToDashboard = () => {
    navegate('/dashboard')
  }

  const handeLogout = () => {
    tokenStore.clearTokens()
    window.location.reload()
  }

  return (
    <ContainerHeader style={{ display: !user ? 'none' : 'flex'}} >
      <Logo onClick={handeGoToDashboard} />
      <div>
        <ContainerIconsHeader onClick={handeGoToNotifications}>
          <MessageSquare size={30} color={theme.colors.greenIconDark} />
          Notificações
        </ContainerIconsHeader>
        <ContainerIconsHeader onClick={() => openDeviceModal()}>
          <Plus size={30} color={theme.colors.greenIconDark} />
          Dispositivo
        </ContainerIconsHeader>
        <LogOut style={{ marginLeft: '4px'}} onClick={handeLogout} color={theme.colors.greenIconDark} />
      </div>
    </ContainerHeader>
  )
}

export default Header;
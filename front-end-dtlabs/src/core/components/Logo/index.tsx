import { theme } from '@/styles/theme'
import { LoginTitle, LogoContainer, LogoContainerIcon } from './styled'
import { Activity } from 'lucide-react'

interface LogoProps {
  onClick?: () => void;
}

const Logo = ({ onClick }:LogoProps) => {
  return (
    <LogoContainer onClick={onClick}>
      <LogoContainerIcon>
        <Activity color={theme.colors.greenLight} />
      </LogoContainerIcon>
      <LoginTitle>IoT Monitor</LoginTitle>
    </LogoContainer>
  )
}

export default Logo
import DevicesGrid from '@/core/components/DevicesGrid';
import { useAuthStore } from '@/core/infra/store/authStore';
import { DashboardContainer, DashboardTitle } from './styled';

const Dashboard = () => {
  const {user} = useAuthStore();

  console.log('notificações', user?.devices)

  return (
    <DashboardContainer>
      <DashboardTitle>Todos os dispositivos</DashboardTitle>
      <DevicesGrid userData={user} />
    </DashboardContainer>
  )
}

export default Dashboard;
import { EmptyState } from '../styled';

const DeviceEmpty = () => {
  return (
    <EmptyState>
      <div className="empty-icon">📱</div>
      <h3>Nenhum dispositivo encontrado</h3>
      <p>Adicione seu primeiro dispositivo para começar o monitoramento</p>
    </EmptyState>
  )
}

export default DeviceEmpty;
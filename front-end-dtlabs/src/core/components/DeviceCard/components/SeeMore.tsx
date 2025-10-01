import { ChevronsRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SeeMore } from '../styled';

interface SeeMoreProps {
  deviceId: string;
}

const SeeMoreComponent = ({deviceId}: SeeMoreProps) => {
  const navigate = useNavigate()

  return (
    <SeeMore onClick={() => navigate(`/devices/${deviceId}`)} >
        Ver mais
        <ChevronsRight color='rgba(253, 253, 253, 0.75)' />
      </SeeMore>
  )
}

export default SeeMoreComponent;
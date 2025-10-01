import { useGetHeartbeat } from '@/hooks/useGetHeartbeat';
import { useGetHeartbeatForm } from '@/hooks/useGetHeartbeatForm';
import { FilterHeartbeatForm, FormFilterHeartbeat, FormInput } from '../styled';
import { getHeartbeatProps } from '@/core/domain/types/heartbeat-types';
import { Button } from '@/core/components/Button';
import { ButtonLink } from '@/core/components/ButtonLink';
import { useHeartbeatStore } from '@/core/infra/store/heartbeatStore';

interface GetHeartbeatFilterProps {
  deviceId: string
}

const GetHeartbeatFilter = ({deviceId}: GetHeartbeatFilterProps) => {
  const {heartbeatClean} = useHeartbeatStore()
  const { mutate: getHeartbeat, isPending } = useGetHeartbeat();
  const { handleSubmit, register, errors } = useGetHeartbeatForm();

  const onSubmit = handleSubmit((data) => {
    const params: getHeartbeatProps = {
      deviceId,
      from: data.from,
      to: data.to,
    }
    getHeartbeat(params);
  });

  const cleanHeartbeat = () => {
    heartbeatClean()
  }

  return (
    <div style={{ display: 'flex'}}>
      <FilterHeartbeatForm onSubmit={onSubmit}>
        <FormFilterHeartbeat>
          De:
          <FormInput
            type="date"
            {...register("from")}
          />
          {errors.from && <span>{errors.from.message}</span>}
        </FormFilterHeartbeat>

        <FormFilterHeartbeat>
          Até:
          <FormInput
            type="date"
            {...register("to")}
          />
          {errors.to && <span>{errors.to.message}</span>}
        </FormFilterHeartbeat>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Filtrando..." : "Filtrar"}
        </Button>
      </FilterHeartbeatForm>
      <ButtonLink onClick={cleanHeartbeat}>
        Limpar
      </ButtonLink>
    </div>
  );
};

export default GetHeartbeatFilter;

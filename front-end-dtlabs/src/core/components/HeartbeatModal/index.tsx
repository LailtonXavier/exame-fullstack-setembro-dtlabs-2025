import { RegisterHeartbeatDto } from '@/core/domain/types/heartbeat-types';
import { useRegisterHeartbeat } from '@/hooks/useRegisterHeartbeat';
import { useRegisterHeartbeatForm } from '@/hooks/useRegisterHeartbeatForm';
import { useEffect, useState } from 'react';
import { Button } from '../Button';
import { ButtonBack } from '../ButtonBack';
import { Divid } from '../divid';
import {
  FormGroup,
  FormGroupContainer,
  FormInput,
  FormLabel,
  HeartbeatModalCard,
  HeartbeatModalContainer,
  HeartbeatModalForm,
  HeartbeatModalSubtitle,
  SwitchButton,
  SwitchButtonElement,
} from './styled';
import { RegisterHeartbeatSchemaZod } from '@/shared/utils/registerHeartbeatSchema';

interface HeartbeatModalProps {
  onClose: () => void;
  deviceId: string;
}

const HeartbeatModal = ({ onClose, deviceId }: HeartbeatModalProps) => {
  const { mutate: registerHeartbeat, isPending } = useRegisterHeartbeat();
  const { handleSubmit, register, errors, clearErrors, setValue } =
    useRegisterHeartbeatForm();

  const [connectivity, setConnectivity] = useState<boolean>(false);

  useEffect(() => {
    const errorFields = Object.keys(errors) as (keyof RegisterHeartbeatSchemaZod)[];

    if (errorFields.length > 0) {
      const timeout = setTimeout(() => {
        errorFields.forEach((field) => clearErrors(field));
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [errors, clearErrors]);

  useEffect(() => {
    setValue('connectivity', connectivity ? 1 : 0, { shouldDirty: true });
  }, [connectivity, setValue]);

  useEffect(() => {
    setValue('deviceId', deviceId);
  }, [deviceId, setValue]);

  const onSubmit = handleSubmit((data) => {
    const params: RegisterHeartbeatDto = {
      deviceId,
      bootTime: data.bootTime instanceof Date ? data.bootTime : new Date(data.bootTime),
      connectivity: String(data.connectivity),
      cpuUsage: Number(data.cpuUsage),
      diskFree: Number(data.diskFree),
      latencyDns: Number(data.latencyDns),
      ramUsage: Number(data.ramUsage),
      temperature: Number(data.temperature),
    };

    registerHeartbeat(params);
    onClose();
  });

  const title = 'Criar novo heartbeat';

  return (
    <HeartbeatModalContainer>
      <ButtonBack onClick={onClose}>Mostrar todos os heartbeats</ButtonBack>
      <HeartbeatModalCard>
        <HeartbeatModalSubtitle>{title}</HeartbeatModalSubtitle>

        <HeartbeatModalForm onSubmit={onSubmit}>
          <input type="hidden" {...register('connectivity')} />
          <input type="hidden" {...register('deviceId')} />

          <FormGroupContainer>
            <FormGroup>
              <FormLabel>CPU (%)</FormLabel>
              <FormInput
                type="number"
                step="any"
                placeholder="10"
                {...register('cpuUsage', { valueAsNumber: true })}
              />
              {errors.cpuUsage && <span style={{ color: 'red' }}>{errors.cpuUsage?.message}</span>}
            </FormGroup>

            <FormGroup>
              <FormLabel>RAM (%)</FormLabel>
              <FormInput
                type="number"
                step="any"
                placeholder="20"
                {...register('ramUsage', { valueAsNumber: true })}
              />
              {errors.ramUsage && <span style={{ color: 'red' }}>{errors.ramUsage?.message}</span>}
            </FormGroup>
          </FormGroupContainer>

          <FormGroupContainer>
            <FormGroup>
              <FormLabel>Disco Livre (%)</FormLabel>
              <FormInput
                type="number"
                step="any"
                placeholder="16"
                {...register('diskFree', { valueAsNumber: true })}
              />
              {errors.diskFree && <span style={{ color: 'red' }}>{errors.diskFree?.message}</span>}
            </FormGroup>

            <FormGroup>
              <FormLabel>Temperatura (°C)</FormLabel>
              <FormInput
                type="number"
                step="any"
                placeholder="55.2"
                {...register('temperature', { valueAsNumber: true })}
              />
              {errors.temperature && <span style={{ color: 'red' }}>{errors.temperature?.message}</span>}
            </FormGroup>
          </FormGroupContainer>

          <FormGroupContainer>
            <FormGroup>
              <FormLabel>Latência DNS (ms)</FormLabel>
              <FormInput
                type="number"
                step="1"
                placeholder="8888"
                {...register('latencyDns', { valueAsNumber: true })}
              />
              {errors.latencyDns && <span style={{ color: 'red' }}>{errors.latencyDns?.message}</span>}
            </FormGroup>

            <FormGroup>
              <FormLabel>Conectividade</FormLabel>
              <SwitchButton
                role="switch"
                aria-checked={connectivity}
                connectivity={connectivity}
                onClick={() => setConnectivity((prev) => !prev)}
              >
                <SwitchButtonElement connectivity={connectivity} />
              </SwitchButton>
              {errors.connectivity && <span style={{ color: 'red' }}>{errors.connectivity?.message}</span>}
            </FormGroup>
          </FormGroupContainer>

          <FormGroup>
            <FormLabel>Tempo de Inicialização</FormLabel>
            <FormInput
              type="datetime-local"
              {...register('bootTime')}
            />
            {errors.bootTime && <span style={{ color: 'red' }}>{errors.bootTime?.message}</span>}
          </FormGroup>

          <Button type="submit" disabled={isPending}>
            {isPending ? 'Salvando...' : 'Salvar heartbeat'}
          </Button>
          <Divid />
        </HeartbeatModalForm>
      </HeartbeatModalCard>
    </HeartbeatModalContainer>
  );
};

export default HeartbeatModal;

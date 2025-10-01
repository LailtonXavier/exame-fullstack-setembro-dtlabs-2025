import { DeviceModalCard, DeviceModalContainer, DeviceModalForm, DeviceModalSubtitle, FormGroup, FormInput, FormLabel } from './styled';
import { useRegisterDevice } from '@/hooks/useRegisterDevice';
import { Button } from '../Button';
import { ButtonBack } from '../ButtonBack';
import { Divid } from '../divid';
import { useRegisterDeviceForm } from '@/hooks/useRegisterDeviceForm';
import { useEffect } from 'react';
import { useUiStore } from '@/core/infra/store/uiStore';
import { UpdateDeviceDto } from '@/core/domain/types/device-types';
import { useUpdateDevice } from '@/hooks/useUpdateDevice';
import { RegisterDeviceSchemaZod } from '@/shared/utils/registerDeviceSchema';

interface DeviceModalProps {
  onClose: () => void
}

const DeviceModal = ({onClose}: DeviceModalProps) => {
  const { selectedDevice: device } = useUiStore();
  const { mutate: registerDevice, isPending } = useRegisterDevice();
  const { mutate: updateDevice, isPending: isPendingUpdate } = useUpdateDevice();
  const { handleSubmit, register, errors, clearErrors, setValue } = useRegisterDeviceForm();

  useEffect(() => {
    if (device) {
     setValue('name', device.name)
     setValue('location', device.location)
     setValue('sn', device.sn)
     setValue('description', device.description || '')
    }
  }, [device, setValue]);
 
  useEffect(() => {
    const errorFields = Object.keys(errors) as (keyof RegisterDeviceSchemaZod)[];

    if (errorFields.length > 0) {
      const timeout = setTimeout(() => {
        errorFields.forEach((field) => {
          clearErrors(field);
        });
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [errors, clearErrors]);

  const onSubmit = handleSubmit((data) => {
    if (device) {
      const response: UpdateDeviceDto = {
        location: data.location,
        name: data.name,
        description: data.description || ''
      }

      updateDevice({deviceId: device.uuid, data: response})
      onClose()
      return
    }
    registerDevice(data);
    onClose()
  });
  
  const title = device ? 'Editar o dispositivo' : 'Crie um dispositivo'

  return (
    <DeviceModalContainer>
      <ButtonBack 
        onClick={onClose}>
          Voltar para os dispositivos
      </ButtonBack>
      <DeviceModalCard>
        <DeviceModalSubtitle>{title}</DeviceModalSubtitle>

        <DeviceModalForm onSubmit={onSubmit}>
          <FormGroup>
            <FormLabel>Nome</FormLabel>
            <FormInput
              type="text"
              placeholder="PC"
              {...register('name')}
            />
            {errors.name && (
              <span style={{ color: 'red' }}>
                {errors.name.message}
              </span>
            )}
          </FormGroup>

          <FormGroup>
            <FormLabel>Localização</FormLabel>
            <FormInput
              type="text"
              placeholder="132415"
              {...register('location')}
            />
            {errors.location && (
              <span style={{ color: 'red' }}>
                {errors.location.message}
              </span>
            )}
          </FormGroup>

          {!device && (
            <FormGroup>
            <FormLabel>SN</FormLabel>
            <FormInput
              type="text"
              placeholder="123456789102"
              {...register('sn')}
            />
            {errors.sn && (
              <span style={{ color: 'red' }}>
                {errors.sn.message}
              </span>
            )}
          </FormGroup>
          )}          

          <FormGroup>
            <FormLabel>Descrição</FormLabel>
            <FormInput
              type="text"
              placeholder="Alguma descrição"
              {...register('description')}
            />
            {errors.description && (
              <span style={{ color: 'red' }}>
                {errors.description.message}
              </span>
            )}
          </FormGroup>

          <Button type="submit" disabled={isPending}>
            {isPending || isPendingUpdate ? 'Salvando...' : 'Salvar dispositivo'}
          </Button>
          <Divid />
        </DeviceModalForm>
    </DeviceModalCard>
    </DeviceModalContainer>
  )
}

export default DeviceModal;
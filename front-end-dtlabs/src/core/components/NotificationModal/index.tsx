
  import { RegisterNotificationDto } from '@/core/domain/types/notification-types';
  import { useRegisterNotification } from '@/hooks/useRegisterNotification';
  import { useRegisterNotificationForm } from '@/hooks/useRegisterNotificationForm';
  import { RegisterNotificationSchemaZod } from '@/shared/utils/registerNotificationSchema';
  import { useEffect } from 'react';
  import { ButtonBack } from '../ButtonBack';
  import { FormGroup, FormInput, FormLabel, FormSelect, NotificationModalCard, NotificationModalContainer, NotificationModalForm, NotificationModalSubtitle } from './styled';
  import { Button } from '../Button';

  interface NotificationModalProps {
    deviceId: string | undefined;
    userId: string | undefined;
    deviceName: string | undefined
    onClose: () => void;
  }

  const NotificationModal = ({ onClose, userId, deviceId, deviceName }: NotificationModalProps) => {
    const { mutate: registerNotification, isPending } = useRegisterNotification();
    const { handleSubmit, register, errors, clearErrors, setValue } =
      useRegisterNotificationForm();

    useEffect(() => {
      const errorFields = Object.keys(errors) as (keyof RegisterNotificationSchemaZod)[];

      if (errorFields.length > 0) {
        const timeout = setTimeout(() => {
          errorFields.forEach((field) => clearErrors(field));
        }, 2000);

        return () => clearTimeout(timeout);
      }
    }, [errors, clearErrors]);

    useEffect(() => {
      if (deviceId && userId) {
        setValue('deviceId', deviceId);
        setValue('userId', userId);
      }
    }, [deviceId, userId, setValue]);

    const onSubmit = handleSubmit((data) => {
      if (deviceId && userId) {
        const params: RegisterNotificationDto = {
          deviceId,
          userId,
          condition: data.condition,
          metric: data.metric,
          threshold: data.threshold,
        };

        registerNotification(params);
        onClose();
    }
    });

    return (
      <NotificationModalContainer>
        <ButtonBack onClick={onClose}>Mostrar as notificações</ButtonBack>
        <NotificationModalCard>
          <NotificationModalSubtitle>Criar Notificação para o {deviceName}</NotificationModalSubtitle>

          <NotificationModalForm onSubmit={onSubmit}>
            <FormGroup>
              <FormLabel>Métrica</FormLabel>
              <FormSelect {...register("metric")}>
                <option value="cpuUsage">CPU Usage</option>
                <option value="ramUsage">RAM Usage</option>
                <option value="diskFree">Disco Livre</option>
                <option value="temperature">Temperatura</option>
                <option value="latencyDns">Latência DNS</option>
              </FormSelect>
              {errors.metric && (
                <span style={{ color: "red" }}>
                  {errors.metric.message}
                </span>
              )}
            </FormGroup>

            <FormGroup>
              <FormLabel>Condição</FormLabel>
              <FormSelect {...register("condition")}>
                <option value=">">Maior que</option>
                <option value="<">Menor que</option>
                <option value="==">Igual a</option>
              </FormSelect>
              {errors.condition && (
                <span style={{ color: "red" }}>
                  {errors.condition.message}
                </span>
              )}
            </FormGroup>

            <FormGroup>
              <FormLabel>Threshold</FormLabel>
              <FormInput
                type="number"
                placeholder="Ex: 80"
                {...register("threshold", { valueAsNumber: true })}
              />
              {errors.threshold && (
                <span style={{ color: "red" }}>
                  {errors.threshold.message}
                </span>
              )}
            </FormGroup>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : 'Salvar notificação'}
            </Button>
          </NotificationModalForm>
        </NotificationModalCard>
      </NotificationModalContainer>
    );
  };

  export default NotificationModal;

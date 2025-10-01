import {
  FormGroup,
  FormInput,
  FormLabel,
  RegisterCard,
  RegisterContainer,
  RegisterForm,
  RegisterHeader,
  RegisterSubtitle,
  RegisterSubtitleSmall
} from './styled';

import { Button } from '@/core/components/Button';
import { ButtonLink } from '@/core/components/ButtonLink';
import { Divid } from '@/core/components/divid';
import Logo from '@/core/components/Logo';
import { useRegisterForm } from '@/hooks/useRegisterForm';
import { useRegisterUser } from '@/hooks/useRegisterUser';
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const { mutate: signUp, isPending } = useRegisterUser();
  const { handleSubmit, register, errors } = useRegisterForm();
  const navigate = useNavigate();

  const onSubmit = handleSubmit((data) => {
    signUp(data);
  });

  const handleGoToRegister = () => {
    navigate('/login');
  };

  return (
    <RegisterContainer>
      <RegisterHeader>
        <Logo />
        <RegisterSubtitleSmall>
          Monitore seus dispositivos IoT em tempo real
        </RegisterSubtitleSmall>
      </RegisterHeader>

      <RegisterCard>
          <RegisterSubtitle>Crie uma conta</RegisterSubtitle>

          <RegisterForm onSubmit={onSubmit}>
            <FormGroup>
              <FormLabel>Nome</FormLabel>
              <FormInput
                type="text"
                placeholder="admin"
                {...register('name')}
              />
              {errors.name && (
                <span style={{ color: 'red' }}>
                  {errors.name.message}
                </span>
              )}
            </FormGroup>

            <FormGroup>
              <FormLabel>Email</FormLabel>
              <FormInput
                type="email"
                placeholder="admin@iot.com"
                {...register('email')}
              />
              {errors.email && (
                <span style={{ color: 'red' }}>
                  {errors.email.message}
                </span>
              )}
            </FormGroup>

             <FormGroup>
              <FormLabel>Password</FormLabel>
              <FormInput
                type="password"
                placeholder="password"
                {...register('password')}
              />
              {errors.password && (
                <span style={{ color: 'red' }}>
                  {errors.password.message}
                </span>
              )}
            </FormGroup>

            <Button type="submit" disabled={isPending}>
              {isPending ? 'Entrando...' : 'Criar conta'}
            </Button>
             <Divid />
            <ButtonLink
              type="button"
              onClick={handleGoToRegister}
              style={{ background: 'transparent' }}
            >
              Fazer login
            </ButtonLink>
          </RegisterForm>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;

import {
  FormGroups,
  FormInput,
  FormLabel,
  LoginCard,
  LoginContainer,
  LoginForm,
  LoginHeader,
  LoginSubtitle,
  LoginSubtitleSmall
} from './styled';

import { Button } from '@/core/components/Button';
import { Divid } from '@/core/components/divid';
import Logo from '@/core/components/Logo';
import { useLogin } from '@/hooks/useLogin';
import { useLoginForm } from '@/hooks/useLoginForm';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const { mutate: login, isPending } = useLogin();
  const { handleSubmit, register, errors } = useLoginForm();
  const navigate = useNavigate();

  const onSubmit = handleSubmit((data) => {
    login(data);
  });

  const handleGoToRegister = () => {
    navigate('/register');
  };

  return (
    <LoginContainer>
      <LoginHeader>
        <Logo />
        <LoginSubtitleSmall>
          Monitore seus dispositivos IoT em tempo real
        </LoginSubtitleSmall>
      </LoginHeader>

      <LoginCard>
        <LoginSubtitle>Faça login</LoginSubtitle>

        <LoginForm onSubmit={onSubmit}>
          <FormGroups>
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
          </FormGroups>

          <FormGroups>
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
          </FormGroups>

          <Button type="submit" isLoading={isPending}>
            Entrar
          </Button>
          <Divid />
          <Button
            type="button"
            onClick={handleGoToRegister}
            style={{ background: '#555' }}
          >
            Criar conta
          </Button>
        </LoginForm>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;

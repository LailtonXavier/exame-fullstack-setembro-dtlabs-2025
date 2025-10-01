import IoTLoading from '@/core/components/IoTLoading';
import { useAuthStore } from '@/core/infra/store/authStore';
import { JSX } from 'react';
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: JSX.Element;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return <IoTLoading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

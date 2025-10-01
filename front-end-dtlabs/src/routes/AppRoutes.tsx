import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from '@/core/infra/store/authStore';
import { PrivateRoute } from './PrivatesRoute';
import { Suspense, lazy } from 'react';
import IoTLoading from '@/core/components/IoTLoading';
import DeviceDetail from '@/pages/deviceDetail';
import Notification from '@/pages/notification';

const Login = lazy(() => import('@/pages/auth/login'));
const Register = lazy(() => import('@/pages/auth/register'));
const Dashboard = lazy(() => import('@/pages/dashboard'));

export function AppRoutes() {
  const { isLoading, user } = useAuthStore();

  if (isLoading) {
    return <IoTLoading />;
  }

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/devices/:id"
          element={
            <PrivateRoute>
              <DeviceDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <Notification />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}

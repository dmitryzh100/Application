import { Navigate, Outlet } from 'react-router-dom';

import { useAuthStore } from '@/modules/auth';
import { Routes } from '@/shared/constants/routes.constants';

export const ProtectedRoute = (): React.ReactElement => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={Routes.events} replace />;
  }

  return <Outlet />;
};

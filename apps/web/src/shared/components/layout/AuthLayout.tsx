import { Outlet } from 'react-router-dom';

export const AuthLayout = (): React.ReactElement => {
  return (
    <div className="bg-muted/50 flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
};

import { Suspense } from 'react';

import { Toaster } from 'sonner';

import { useAuthMeSuspense } from '@/modules/auth';
import { AppRoutes } from '@/shared/components/app/AppRoutes';
import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';

const AppContent = (): React.ReactElement => {
  useAuthMeSuspense();

  return <AppRoutes />;
};

const App = (): React.ReactElement => {
  return (
    <>
      <Suspense fallback={<LoadingSpinner className="h-screen" />}>
        <AppContent />
      </Suspense>
      <Toaster />
    </>
  );
};

export default App;

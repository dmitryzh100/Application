import { Outlet } from 'react-router-dom';

import { ScrollToTop } from '../ui/scroll-to-top';
import { Navbar } from './Navbar';

export const AppLayout = (): React.ReactElement => {
  return (
    <div className="bg-background flex h-screen flex-col overflow-hidden">
      <Navbar />
      <main className="container mx-auto flex min-h-0 flex-1 flex-col overflow-auto px-4 py-4">
        <Outlet />
      </main>
      <ScrollToTop />
    </div>
  );
};

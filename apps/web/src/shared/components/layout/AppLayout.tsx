import { Outlet } from 'react-router-dom';

import { ScrollToTop } from '../ui/scroll-to-top';
import { Navbar } from './Navbar';

export const AppLayout = (): React.ReactElement => {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <ScrollToTop />
    </div>
  );
};

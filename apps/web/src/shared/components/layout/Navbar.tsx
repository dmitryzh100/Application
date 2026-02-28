import { useState, useTransition } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { CalendarDays, List, LogOut, Menu, Plus, User } from 'lucide-react';

import { useAuthStore, useLogout } from '@/modules/auth';
import { Routes } from '@/shared/constants/routes.constants';

import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';

export const Navbar = (): React.ReactElement => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const [isLoggingOut, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = (): void => {
    startTransition(async () => {
      await logoutMutation.mutateAsync();
      setMobileOpen(false);
      navigate(Routes.events);
    });
  };

  const handleNavigate = (route: string): void => {
    setMobileOpen(false);
    navigate(route);
  };

  return (
    <nav className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 border-b backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="hidden items-center gap-1 md:flex">
          <Link
            to={Routes.events}
            className="hover:text-primary flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <List className="h-4 w-4" aria-hidden="true" />
            Events
          </Link>

          {isAuthenticated && (
            <Link
              to={Routes.myEvents}
              className="hover:text-primary ml-4 flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              My Events
            </Link>
          )}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <>
              <Button variant="default" size="sm" onClick={() => navigate(Routes.eventCreate)}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Create Event
              </Button>

              <div className="text-muted-foreground ml-2 flex items-center gap-2 text-sm">
                <User className="h-4 w-4" aria-hidden="true" />
                {user?.name || `User (${user?.email})`}
              </div>

              <Button
                variant="ghost"
                size="sm"
                aria-label="Log out"
                aria-busy={isLoggingOut}
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate(Routes.login)}>
                Log in
              </Button>
              <Button variant="default" size="sm" onClick={() => navigate(Routes.register)}>
                Sign up
              </Button>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-64">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-1 px-4">
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => handleNavigate(Routes.events)}
              >
                <List className="mr-2 h-4 w-4" aria-hidden="true" />
                Events
              </Button>

              {isAuthenticated && (
                <>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => handleNavigate(Routes.myEvents)}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" aria-hidden="true" />
                    My Events
                  </Button>

                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => handleNavigate(Routes.eventCreate)}
                  >
                    <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                    Create Event
                  </Button>
                </>
              )}
            </div>

            <div className="mt-auto border-t px-4 pt-4">
              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" aria-hidden="true" />
                    {user?.name || `User (${user?.email})`}
                  </div>

                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                    Log out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" onClick={() => handleNavigate(Routes.login)}>
                    Log in
                  </Button>
                  <Button variant="default" onClick={() => handleNavigate(Routes.register)}>
                    Sign up
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

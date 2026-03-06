import { ReactElement } from 'react';
import { Navigate, Route, Routes as RouterRoutes } from 'react-router-dom';

import { loginConfig, registerConfig } from '@/modules/auth';
import { Routes } from '@/shared/constants/routes.constants';

import { withLazyLoad } from '../hoc/withLazyLoad';
import { AppLayout } from '../layout/AppLayout';
import { AuthLayout } from '../layout/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';

const AuthPage = withLazyLoad(
  () => import('@/modules/auth/pages/AuthPage'),
  (m) => m.AuthPage,
);
const EventsPage = withLazyLoad(
  () => import('@/modules/events/pages/EventsPage'),
  (m) => m.EventsPage,
);
const EventDetailsPage = withLazyLoad(
  () => import('@/modules/events/pages/EventDetailsPage'),
  (m) => m.EventDetailsPage,
);
const CreateEventPage = withLazyLoad(
  () => import('@/modules/events/pages/CreateEventPage'),
  (m) => m.CreateEventPage,
);
const EditEventPage = withLazyLoad(
  () => import('@/modules/events/pages/EditEventPage'),
  (m) => m.EditEventPage,
);
const MyEventsPage = withLazyLoad(
  () => import('@/modules/events/pages/my-events'),
  (m) => m.MyEventsPage,
);
const ChatPage = withLazyLoad(
  () => import('@/modules/chat/pages/ChatPage'),
  (m) => m.ChatPage,
);

export const AppRoutes = (): ReactElement => {
  return (
    <RouterRoutes>
      <Route element={<AuthLayout />}>
        <Route path={Routes.login} element={<AuthPage config={loginConfig} />} />
        <Route path={Routes.register} element={<AuthPage config={registerConfig} />} />
      </Route>

      <Route element={<AppLayout />}>
        <Route path={Routes.events} element={<EventsPage />} />
        <Route path={Routes.eventDetails()} element={<EventDetailsPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path={Routes.eventCreate} element={<CreateEventPage />} />
          <Route path={Routes.eventEdit()} element={<EditEventPage />} />
          <Route path={Routes.myEvents} element={<MyEventsPage />} />
          <Route path={Routes.chat} element={<ChatPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={Routes.events} replace />} />
    </RouterRoutes>
  );
};

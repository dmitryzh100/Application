export const Routes = {
  login: '/login',
  register: '/register',
  events: '/events',
  eventDetails: (id?: string): string => `/events/${id ?? ':id'}`,
  eventCreate: '/events/create',
  eventEdit: (id?: string): string => `/events/${id ?? ':id'}/edit`,
  myEvents: '/my-events',
} as const;

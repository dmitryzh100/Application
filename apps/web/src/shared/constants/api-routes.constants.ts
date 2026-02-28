export const Api = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
    logout: '/auth/logout',
  },
  events: {
    base: '/events',
    byId: (id: string): string => `/events/${id}`,
    join: (id: string): string => `/events/${id}/join`,
    leave: (id: string): string => `/events/${id}/leave`,
  },
  users: {
    myEvents: '/users/me/events',
  },
} as const;

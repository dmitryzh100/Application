import { create } from 'zustand';

import type { UserBase } from '@event-management/shared';

interface AuthState {
  user: UserBase | null;
  isAuthenticated: boolean;

  setUser: (user: UserBase) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user: UserBase): void => {
    set({ user, isAuthenticated: true });
  },

  clearUser: (): void => {
    set({ user: null, isAuthenticated: false });
  },
}));

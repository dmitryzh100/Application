import { useEffect } from 'react';

import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import type { AuthResponse, UserLoginRequest, UserRegisterRequest } from '@event-management/shared';

import { authApi } from '../api/auth.api';
import { useAuthStore } from '../stores/auth.store';

export const authKeys = {
  me: ['auth', 'me'] as const,
};

function useSyncAuthStore(data: AuthResponse | null | undefined, isError = false): void {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  useEffect(() => {
    if (data) {
      setUser(data.user);
    } else if (isError || data === null) {
      clearUser();
    }
  }, [data, isError, setUser, clearUser]);
}

export function useAuthMe(): { isLoading: boolean } {
  const { data, isLoading } = useQuery<AuthResponse | null, Error>({
    queryKey: authKeys.me,
    queryFn: authApi.me,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useSyncAuthStore(data);

  return { isLoading };
}

export function useAuthMeSuspense(): void {
  const { data } = useSuspenseQuery<AuthResponse | null, Error>({
    queryKey: authKeys.me,
    queryFn: async () => {
      try {
        return await authApi.me();
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useSyncAuthStore(data);
}

export function useLogin(): ReturnType<typeof useMutation<AuthResponse, Error, UserLoginRequest>> {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation<AuthResponse, Error, UserLoginRequest>({
    mutationFn: (data) => authApi.login(data),
    onSuccess: (result) => {
      setUser(result.user);
      queryClient.setQueryData(authKeys.me, result);
    },
  });
}

export function useRegister(): ReturnType<
  typeof useMutation<AuthResponse, Error, UserRegisterRequest>
> {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation<AuthResponse, Error, UserRegisterRequest>({
    mutationFn: (data) => authApi.register(data),
    onSuccess: (result) => {
      setUser(result.user);
      queryClient.setQueryData(authKeys.me, result);
    },
  });
}

export function useLogout(): ReturnType<typeof useMutation<void, Error, void>> {
  const queryClient = useQueryClient();
  const clearUser = useAuthStore((s) => s.clearUser);

  return useMutation<void, Error, void>({
    mutationFn: authApi.logout,
    onSettled: () => {
      clearUser();
      queryClient.setQueryData(authKeys.me, null);
      queryClient.invalidateQueries();
    },
  });
}

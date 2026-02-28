import { loginSchema, registerSchema } from '@event-management/shared';

import { Routes } from '@/shared/constants/routes.constants';

import { authApi } from '../api/auth.api';
import type { AuthPageConfig } from '../pages/AuthPage';

export const loginConfig: AuthPageConfig = {
  pageTitle: 'Sign In - Event Management',
  cardTitle: 'Welcome back',
  cardDescription: 'Sign in to your account',
  schema: loginSchema,
  fields: [
    { name: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com' },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
    },
  ],
  submitLabel: 'Sign in',
  pendingText: 'Signing in...',
  apiCall: (data) => authApi.login({ email: data.email, password: data.password }),
  errorFallback: 'Login failed',
  footerText: "Don't have an account?",
  footerLinkText: 'Sign up',
  footerLinkTo: Routes.register,
};

export const registerConfig: AuthPageConfig = {
  pageTitle: 'Sign Up - Event Management',
  cardTitle: 'Create an account',
  cardDescription: 'Sign up to get started',
  schema: registerSchema,
  fields: [
    { name: 'name', label: 'Name (optional)', type: 'text', placeholder: 'John Doe' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com' },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'At least 6 characters',
    },
  ],
  submitLabel: 'Sign up',
  pendingText: 'Creating account...',
  apiCall: (data) =>
    authApi.register({ name: data.name, email: data.email, password: data.password }),
  errorFallback: 'Registration failed',
  footerText: 'Already have an account?',
  footerLinkText: 'Sign in',
  footerLinkTo: Routes.login,
};

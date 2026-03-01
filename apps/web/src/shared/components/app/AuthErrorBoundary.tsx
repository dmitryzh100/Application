import { Component, type ReactNode } from 'react';

import { isAxiosError } from 'axios';

import { Routes } from '@/shared/constants/routes.constants';

interface Props {
  children: ReactNode;
}

interface State {
  hasAuthError: boolean;
}

export class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasAuthError: false };
  }

  static getDerivedStateFromError(error: unknown): State | null {
    if (isAxiosError(error) && error.response?.status === 401) {
      return { hasAuthError: true };
    }

    return null;
  }

  componentDidUpdate(): void {
    if (this.state.hasAuthError) {
      window.location.href = Routes.login;
    }
  }

  render(): ReactNode {
    if (this.state.hasAuthError) {
      return null;
    }

    return this.props.children;
  }
}

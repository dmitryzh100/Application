import { useActionState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';
import type { ObjectSchema, ValidationError } from 'yup';

import type { AuthResponse } from '@event-management/shared';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { SubmitButton } from '@/shared/components/ui/submit-button';
import { Typography } from '@/shared/components/ui/typography';
import { Routes } from '@/shared/constants/routes.constants';

import { authKeys } from '../hooks/useAuthQueries';
import { useAuthStore } from '../stores/auth.store';

export interface AuthField {
  name: string;
  label: string;
  type: string;
  placeholder: string;
}

export interface AuthPageConfig {
  pageTitle: string;
  cardTitle: string;
  cardDescription: string;
  schema: ObjectSchema<Record<string, string>>;
  fields: AuthField[];
  submitLabel: string;
  pendingText: string;
  apiCall: (data: Record<string, string>) => Promise<AuthResponse>;
  errorFallback: string;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
}

interface AuthFormState {
  fieldErrors: Record<string, string>;
  serverError: string | null;
}

const initialState: AuthFormState = {
  fieldErrors: {},
  serverError: null,
};

export const AuthPage = ({ config }: { config: AuthPageConfig }): React.ReactElement => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  const formAction = async (_prev: AuthFormState, formData: FormData): Promise<AuthFormState> => {
    const data: Record<string, string> = {};

    for (const field of config.fields) {
      data[field.name] = formData.get(field.name) as string;
    }

    try {
      await config.schema.validate(data, { abortEarly: false });
    } catch (err) {
      const validationError = err as ValidationError;
      const fieldErrors: Record<string, string> = {};

      for (const inner of validationError.inner) {
        if (inner.path && !fieldErrors[inner.path]) {
          fieldErrors[inner.path] = inner.message;
        }
      }

      return { fieldErrors, serverError: null };
    }

    try {
      const result = await config.apiCall(data);
      setUser(result.user);
      queryClient.setQueryData(authKeys.me, result);
      navigate(Routes.events);

      return initialState;
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        config.errorFallback;

      return { fieldErrors: {}, serverError: message };
    }
  };

  const [state, action] = useActionState(formAction, initialState);

  return (
    <Card>
      <title>{config.pageTitle}</title>

      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{config.cardTitle}</CardTitle>
        <CardDescription>{config.cardDescription}</CardDescription>
      </CardHeader>

      <form action={action}>
        <CardContent className="space-y-4">
          {state.serverError && (
            <div role="alert" className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
              {state.serverError}
            </div>
          )}

          {config.fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
              />

              {state.fieldErrors[field.name] && (
                <Typography variant="error">{state.fieldErrors[field.name]}</Typography>
              )}
            </div>
          ))}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <SubmitButton className="w-full" pendingText={config.pendingText}>
            {config.submitLabel}
          </SubmitButton>

          <Typography variant="muted">
            {config.footerText}{' '}
            <Link to={config.footerLinkTo} className="text-primary hover:underline">
              {config.footerLinkText}
            </Link>
          </Typography>
        </CardFooter>
      </form>
    </Card>
  );
};

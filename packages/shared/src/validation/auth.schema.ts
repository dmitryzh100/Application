import * as yup from 'yup';

const baseAuthSchema = yup.object({
  name: yup
    .string()
    .optional()
    .default('')
    .test('min-if-provided', 'Name must be at least 2 characters', (value) => {
      if (!value || value.length === 0) return true;

      return value.length >= 2;
    }),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const registerSchema = baseAuthSchema;
export const loginSchema = baseAuthSchema.omit(['name']);

export type LoginFormData = yup.InferType<typeof loginSchema>;
export type RegisterFormData = yup.InferType<typeof registerSchema>;

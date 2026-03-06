import * as yup from 'yup';

const envSchema = yup.object({
  NODE_ENV: yup.string().oneOf(['development', 'production']).default('development'),
  BACKEND_PORT: yup
    .number()
    .integer()
    .positive()
    .default(3000)
    .transform((value, original) => (original === '' ? undefined : value)),
  CORS_ORIGIN: yup.string().default('http://localhost:5173'),
  JWT_SECRET: yup.string().required('JWT_SECRET is required'),
  JWT_EXPIRES_IN: yup.string().default('7d'),
  DB_HOST: yup.string().default('localhost'),
  DB_PORT: yup
    .number()
    .integer()
    .positive()
    .default(5432)
    .transform((value, original) => (original === '' ? undefined : value)),
  DB_USERNAME: yup.string().default('postgres'),
  DB_PASSWORD: yup.string().default('postgres'),
  DB_NAME: yup.string().default('event_management'),
  GROQ_API_KEY: yup.string().optional(),
  GROQ_MODEL: yup.string().default('llama-3.3-70b-versatile'),
  GROQ_MAX_TOKENS: yup
    .number()
    .integer()
    .positive()
    .default(1024)
    .transform((value, original) => (original === '' ? undefined : value)),
  GROQ_TEMPERATURE: yup
    .number()
    .min(0)
    .max(2)
    .default(0.7)
    .transform((value, original) => (original === '' ? undefined : value)),
  GROQ_MAX_INPUT_TOKENS: yup
    .number()
    .integer()
    .positive()
    .default(4096)
    .transform((value, original) => (original === '' ? undefined : value)),
});

export type EnvConfig = yup.InferType<typeof envSchema>;

let cachedEnv: EnvConfig | null = null;

export function validateEnv(config: Record<string, unknown>): EnvConfig {
  try {
    const validated = envSchema.validateSync(config, {
      abortEarly: false,
      stripUnknown: true,
    });

    cachedEnv = validated;

    return validated;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const messages = error.inner.map((err) => `  - ${err.path}: ${err.message}`).join('\n');

      throw new Error(`Environment validation failed:\n${messages}`);
    }

    throw error;
  }
}

export function getEnv(): EnvConfig {
  if (!cachedEnv) {
    cachedEnv = validateEnv(process.env as Record<string, unknown>);
  }

  return cachedEnv;
}

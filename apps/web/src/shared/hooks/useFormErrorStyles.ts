import { useCallback, useEffect, useRef, useState } from 'react';

const ERROR_CLASS = 'border-destructive focus-visible:ring-destructive';

interface UseFormErrorStylesOptions {
  errors: Record<string, unknown>;
  fieldOrder?: string[];
}

interface UseFormErrorStylesResult {
  getErrorClass: (fieldName: string) => string;
  hasError: (fieldName: string) => boolean;
  onFieldChange: (fieldName: string) => void;
  formRef: React.RefObject<HTMLFormElement | null>;
}

export function useFormErrorStyles(options: UseFormErrorStylesOptions): UseFormErrorStylesResult {
  const { errors, fieldOrder } = options;
  const formRef = useRef<HTMLFormElement | null>(null);
  const [dismissedFields, setDismissedFields] = useState<Set<string>>(new Set());
  const prevErrorsRef = useRef(errors);

  useEffect(() => {
    if (prevErrorsRef.current !== errors) {
      setDismissedFields(new Set());
      prevErrorsRef.current = errors;
    }
  }, [errors]);

  useEffect(() => {
    if (!fieldOrder || !formRef.current) return;

    const firstErrorField = fieldOrder.find((name) => errors[name] && !dismissedFields.has(name));

    if (firstErrorField) {
      const input = formRef.current.querySelector<HTMLElement>(`#${firstErrorField}`);

      input?.focus();
    }
  }, [errors, fieldOrder, dismissedFields]);

  const onFieldChange = useCallback((fieldName: string): void => {
    setDismissedFields((prev) => {
      if (prev.has(fieldName)) return prev;

      const next = new Set(prev);
      next.add(fieldName);

      return next;
    });
  }, []);

  const hasError = useCallback(
    (fieldName: string): boolean => {
      return !!errors[fieldName] && !dismissedFields.has(fieldName);
    },
    [errors, dismissedFields],
  );

  const getErrorClass = useCallback(
    (fieldName: string): string => {
      return hasError(fieldName) ? ERROR_CLASS : '';
    },
    [hasError],
  );

  return { getErrorClass, hasError, onFieldChange, formRef };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from "react";
import z from "zod";

export interface UseFormReturn<T extends Record<string, string>> {
  value: T;
  error: Partial<Record<keyof T, string>>;
  setValue: (key: keyof T, newValue: string) => void;
  setError: (key: keyof T, newValue: string | null) => void;
  validate: () => boolean;
}

// Helper function to extract default/empty values from a flat Zod object schema
function getDefaults<Schema extends z.AnyZodObject>(schema: Schema) {
  const defaultValues: Record<string, string> = {};

  for (const key in schema.shape) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const fieldSchema = schema.shape[key];
    if (fieldSchema instanceof z.ZodDefault) {
      defaultValues[key] = fieldSchema._def.defaultValue() as string;
    } else {
      defaultValues[key] = "";
    }
  }

  return defaultValues;
}

export default function useForm<
  Schema extends z.AnyZodObject,
  FormValues extends Record<string, string> = Extract<
    z.infer<Schema>,
    Record<string, string>
  >,
>(schema: Schema) {
  type FormErrors = keyof FormValues | "main";

  const [value, setValueRaw] = useState<FormValues>(
    getDefaults(schema) as FormValues,
  );
  const [error, setErrorRaw] = useState<Partial<Record<FormErrors, string>>>(
    {},
  );

  const setValue = useCallback((key: keyof FormValues, newValue: string) => {
    setValueRaw((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  }, []);

  const setError = useCallback((key: FormErrors, newValue: string | null) => {
    setErrorRaw((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  }, []);

  const validate = useCallback(() => {
    const result = schema.safeParse(value);

    if (result.success) {
      setErrorRaw({});
      return true;
    }

    const fieldErrors = result.error.flatten().fieldErrors;
    const newErrors: Partial<Record<keyof FormValues, string>> = {};

    for (const key in fieldErrors) {
      // Extract the first error message for each failing field
      newErrors[key as keyof FormValues] = fieldErrors[key]?.[0];
    }

    setErrorRaw(newErrors);

    return false;
  }, [schema, value]);

  return { value, error, setValue, setError, validate };
}

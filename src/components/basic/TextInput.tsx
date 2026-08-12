import { useRef } from "react";
import type { UseFormReturn } from "~/hooks/useForm";
import { cn } from "~/lib/utils";

interface Props<T extends Record<string, string>> {
  label: string;
  formKey: Extract<keyof T, string>;
  form: UseFormReturn<T>;
  type?: string;
}

export default function TextInput<T extends Record<string, string>>({
  form,
  label,
  type,
  formKey,
}: Props<T>) {
  const error = form.error[formKey];

  const prevValue = useRef<string>(null);

  return (
    <div className="group-input relative w-full pt-5">
      <input
        className={cn(
          "border-dark text-dark peer focus:ring-primary h-11 w-full rounded-sm border p-2 transition outline-none focus:ring-1",
          {
            "animate-shake border-red-500": error,
          },
        )}
        id={formKey}
        placeholder=""
        type={type ?? "text"}
        value={form.value[formKey]}
        onChange={(e) => {
          form.setValue(formKey, e.target.value);
        }}
        onFocus={(e) => {
          prevValue.current = e.target.value;
        }}
        onBlur={(e) => {
          if (e.target.value != prevValue.current) {
            form.setError(formKey, null);
          }
        }}
      />
      <label
        htmlFor={formKey}
        className={cn(
          "pointer-events-none absolute top-0 left-0 translate-x-2.5 translate-y-7.5 text-gray-500 transition-transform select-none not-peer-placeholder-shown:pointer-events-auto not-peer-placeholder-shown:translate-x-0 not-peer-placeholder-shown:translate-y-0 not-peer-placeholder-shown:text-sm not-peer-placeholder-shown:select-auto peer-focus:pointer-events-auto peer-focus:translate-x-0 peer-focus:translate-y-0 peer-focus:text-sm peer-focus:select-auto",
          {
            "pointer-events-auto translate-x-0 translate-y-0 text-sm text-red-500 select-auto":
              error,
          },
        )}
      >
        <span>{error ?? label}</span>
      </label>
    </div>
  );
}

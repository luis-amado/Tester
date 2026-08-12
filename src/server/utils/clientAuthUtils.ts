import type { SignInResponse } from "next-auth/react";
import type { UseFormReturn } from "~/hooks/useForm";

export function handleSignInError<T extends Record<string, string>>(
  result: SignInResponse,
  form: UseFormReturn<T>,
) {
  if (!result.error) return true;

  if (result.code === "credentials") {
    form.setError("main", "Invalid credentials, please try again.");
  } else {
    form.setError("main", "Something went wrong, please try again.");
  }
  return false;
}

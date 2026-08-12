"use client";

import Link from "next/link";
import TextInput from "~/components/basic/TextInput";
import useForm from "~/hooks/useForm";
import FluidButton from "~/components/basic/FluidButton";
import { api } from "~/trpc/react";
import z from "zod";
import { useLoginMutation } from "~/hooks/authMutations";
import { useRouter } from "next/navigation";
import { handleSignInError } from "~/server/utils/clientAuthUtils";

const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z
    .string()
    .min(1, "Username is required")
    .regex(/^[^ ]+$/g, "Username must not have spaces")
    .regex(/^[a-zA-Z0-9_.]+$/g, "Username contains invalid characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export default function SignUpPage() {
  const form = useForm(signUpSchema);

  const { mutateAsync: createAccount, isPending: isCreatingUser } =
    api.users.createAccount.useMutation();
  const loginMutation = useLoginMutation();
  const router = useRouter();

  async function signup() {
    if (!form.validate()) return;

    const result = await createAccount(form.value);

    switch (result.err_code) {
      case "ERR_SIGNUP_USERNAME_TAKEN":
        return form.setError("username", "Username is already taken");
      case "ERR_USER_NOT_CREATED":
      case "ERR_UNEXPECTED":
        return form.setError("main", "Something went wrong, please try again.");
    }

    const loginResult = await loginMutation.mutateAsync(form.value);
    if (!handleSignInError(loginResult, form)) {
      router.push("/login?err=not_signed_in");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="flex grow flex-col items-center justify-center">
      <div className="bg-light text-dark flex w-full max-w-110 flex-col gap-3 rounded-xl p-8 shadow-md">
        <div>
          <h3 className="text-primary mb-3 text-lg font-black">TESTER</h3>
          <h2 className="text-3xl font-bold">Sign up</h2>
          <p>Create your account.</p>
        </div>
        <TextInput label="Name" formKey="name" form={form} />
        <TextInput label="Username" formKey="username" form={form} />
        <TextInput
          label="Password"
          formKey="password"
          form={form}
          type="password"
        />
        <div className="mt-6 w-full">
          {form.error.main && (
            <p className="mb-2 text-red-500">{form.error.main}</p>
          )}
          <div className="w-full">
            <FluidButton
              loading={isCreatingUser || loginMutation.isPending}
              className="w-full"
              onClick={signup}
            >
              Create account
            </FluidButton>
          </div>
          <Link className="w-full text-sm" href="/login">
            Already have an account?
          </Link>
        </div>
      </div>
    </main>
  );
}

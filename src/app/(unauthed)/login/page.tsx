"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import TextInput from "~/components/basic/TextInput";
import useForm from "~/hooks/useForm";
import FluidButton from "~/components/basic/FluidButton";
import z from "zod";
import { useLoginMutation } from "~/hooks/authMutations";
import { handleSignInError } from "~/server/utils/clientAuthUtils";
import { useEffect } from "react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function LogInPage() {
  const form = useForm(loginSchema);

  const router = useRouter();
  const loginMutation = useLoginMutation();
  const searchParams = useSearchParams();

  const { setError } = form;

  useEffect(() => {
    const err = searchParams.get("err");

    if (err === "not_signed_in") {
      setError(
        "main",
        "Account created, but failed to sign in. Please try again manually.",
      );
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [setError, searchParams, router]);

  async function login() {
    if (!form.validate()) return;

    const result = await loginMutation.mutateAsync(form.value);
    if (!handleSignInError(result, form)) return;

    router.push("/dashboard");
  }

  return (
    <main className="flex grow flex-col items-center justify-center">
      <div className="bg-light text-dark flex w-full max-w-110 flex-col gap-3 rounded-xl p-8 shadow-md">
        <div>
          <h3 className="text-primary mb-3 text-lg font-black">TESTER</h3>
          <h2 className="text-3xl font-bold">Log in</h2>
          <p>Enter your account information.</p>
        </div>
        <TextInput label="Username" form={form} formKey="username" />
        <TextInput
          label="Password"
          form={form}
          formKey="password"
          type="password"
        />
        <div className="mt-6 w-full">
          {form.error.main && (
            <p className="mb-2 text-red-500">{form.error.main}</p>
          )}
          <div className="w-full">
            <FluidButton
              loading={loginMutation.isPending}
              className="w-full"
              onClick={login}
            >
              Log in
            </FluidButton>
          </div>
          <Link className="w-fit text-sm" href="/signup">
            Don&apos;t have an account?
          </Link>
        </div>
      </div>
    </main>
  );
}

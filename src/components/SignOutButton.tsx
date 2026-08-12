"use client";

import FluidButton from "./basic/FluidButton";
import { useSignOutMutation } from "~/hooks/authMutations";

export default function SignOutButton() {
  const signOutMutation = useSignOutMutation();

  return (
    <FluidButton
      onClick={() => signOutMutation.mutate()}
      className="bg-primary hover:bg-dark h-8 text-sm"
      loading={signOutMutation.isPending || signOutMutation.isSuccess}
    >
      Sign out
    </FluidButton>
  );
}

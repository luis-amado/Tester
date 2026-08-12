import { useMutation } from "@tanstack/react-query";
import { signIn, signOut } from "next-auth/react";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (credentials: { username: string; password: string }) => {
      return signIn("credentials", {
        ...credentials,
        redirect: false,
      });
    },
  });
};

export const useSignOutMutation = () => {
  return useMutation({
    mutationFn: () => {
      return signOut();
    },
  });
};

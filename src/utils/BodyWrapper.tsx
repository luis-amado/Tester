import type { HTMLAttributes, PropsWithChildren } from "react";
import { TRPCReactProvider } from "~/trpc/react";

export default function BodyWrapper({
  children,
  ...props
}: PropsWithChildren & HTMLAttributes<HTMLBodyElement>) {
  return (
    <body {...props}>
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </body>
  );
}

import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";
import { auth } from "~/auth";
import FloatingNavbar, { type NavLink } from "~/components/FloatingNavbar";
import BodyWrapper from "~/utils/BodyWrapper";

export default async function UnauthedLayout({ children }: PropsWithChildren) {
  const links: NavLink[] = [
    // { label: "Home", path: "/" },
    { label: "Log in", path: "/login" },
    { label: "Sign up", path: "/signup" },
  ];

  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <BodyWrapper className="bg-dark text-light flex min-h-screen flex-col">
      <div className="py-5">
        <FloatingNavbar links={links} />
      </div>
      <div className="mt-10 flex w-full grow flex-col p-5 pt-0">{children}</div>
    </BodyWrapper>
  );
}

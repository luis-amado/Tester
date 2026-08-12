import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";
import { auth } from "~/auth";
import Navbar from "~/components/Navbar";
import Sidebar from "~/components/Sidebar";
import BodyWrapper from "~/utils/BodyWrapper";

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();

  if (!session) redirect("/login");

  return (
    <BodyWrapper className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex w-full grow">
        <Sidebar />
        <div className="p-5">{children}</div>
      </div>
    </BodyWrapper>
  );
}

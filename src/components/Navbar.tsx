import { auth } from "~/auth";
import SignOutButton from "./SignOutButton";

export default async function Navbar() {
  const session = await auth();
  if (!session?.user) return;

  return (
    <div className="flex h-15 w-full items-center justify-between px-4 shadow-md">
      <h1 className="text-primary text-xl font-bold">TESTER</h1>
      <div className="flex items-center gap-4">
        <h2 className="text-dark/80 text-sm">
          Hello, <span className="font-bold">{session.user.name}</span>
        </h2>
        {/* <div className="h-8 w-8 rounded-full bg-gray-400"></div> */}
        <SignOutButton />
      </div>
    </div>
  );
}

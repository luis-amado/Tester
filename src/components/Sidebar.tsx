"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import FluidComponent from "./basic/FluidComponent";

function Sidebar() {
  const pathname = usePathname();

  const links = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Classes",
      path: "/classes",
    },
    {
      name: "Tests",
      path: "/tests",
    },
  ];

  return (
    <div className="bg-dark text-light shadow-dark flex w-60 flex-col gap-1 py-5 shadow-xl">
      {links.map((link, i) => {
        const selected = pathname === link.path;
        return (
          <Link
            key={i}
            href={link.path}
            className={cn(
              "flex h-10 w-full items-center px-5 text-lg transition hover:bg-white/10",
              {
                "bg-white/20 hover:bg-white/30": selected,
              },
            )}
          >
            {link.name}
          </Link>
        );
      })}
    </div>
  );
}
export default Sidebar;

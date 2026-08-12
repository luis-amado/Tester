"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "~/lib/utils";
import MouseDownLink from "./basic/MouseDownLink";
import FluidComponent from "./basic/FluidComponent";

export interface NavLink {
  label: string;
  path: string;
}

interface Props {
  links: NavLink[];
}

export default function FloatingNavbar({ links }: Props) {
  const pathname = usePathname();

  return (
    <div className="pointer-events-none fixed z-10 flex w-full justify-center">
      <FluidComponent className="max-w-">
        <div className="from-dark/80 to-dark/50 border-light/40 pointer-events-auto relative flex h-10 w-fit items-center justify-between rounded-full border bg-linear-to-b p-1 shadow-lg backdrop-blur-[2px]">
          <div className="flex h-full gap-1">
            {links.map((link, i) => {
              const isActive = pathname === link.path;

              return (
                <MouseDownLink
                  key={i}
                  href={link.path}
                  className={cn(
                    "hover:bg-light/20 text-light relative z-20 flex h-full items-center rounded-full px-3 transition-colors duration-300 select-none",
                    {
                      "hover:bg-transparent": isActive,
                    },
                  )}
                >
                  {isActive && (
                    <motion.div
                      className="bg-light/70 animate-fade-in absolute inset-0 -z-10 rounded-full shadow-md"
                      layoutId="active-pill"
                      layout="x"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 32,
                      }}
                    />
                  )}
                  <span
                    className={cn("relative z-30 transition", {
                      "text-dark": isActive,
                    })}
                  >
                    {link.label}
                  </span>
                </MouseDownLink>
              );
            })}
          </div>
        </div>
      </FluidComponent>
    </div>
  );
}

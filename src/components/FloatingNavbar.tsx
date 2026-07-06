"use client";

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "~/lib/utils";
import MouseDownLink from "./basic/MouseDownLink";
import FluidComponent from "./FluidComponent";

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
      <FluidComponent>
        <div className="from-dark/80 to-dark/50 border-light/40 pointer-events-auto relative flex h-10 w-fit items-center gap-1 rounded-full border bg-linear-to-b p-1 shadow-lg backdrop-blur-[2px]">
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
                    transition={{ type: "spring", stiffness: 500, damping: 32 }}
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
      </FluidComponent>
    </div>
  );
}

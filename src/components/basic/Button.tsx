import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "~/lib/utils";

type Props = {
  style?: "primary" | "secondary" | "light" | "tertiary";
};

export default function Button({
  children,
  style,
  className,
  ...props
}: PropsWithChildren & Props & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "cursor-pointer rounded-md px-5 py-1",
        {
          "bg-primary text-light": !style || style == "primary",
          "text-primary bg-light": style == "light",
          "bg-accent text-black": style == "secondary",
          "px-2 underline underline-offset-4": style == "tertiary",
        },
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

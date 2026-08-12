import type { ButtonHTMLAttributes } from "react";
import FluidComponent from "./FluidComponent";
import { cn } from "~/lib/utils";
import Spinner from "./Spinner";

interface Props {
  loading?: boolean;
}

export default function FluidButton({
  children,
  className,
  loading,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & Props) {
  return (
    <FluidComponent
      className={className?.includes("w-full") ? "w-full" : ""}
      activeClassName="border-light text-dark shadow-lg backdrop-blur-sm bg-dark/30 hover:bg-dark/30"
      baseStretchScale={1.05}
      maxStretchScale={0.1}
    >
      <button
        className={cn(
          "bg-dark text-light hover:bg-dark/90 disabled:text-light relative flex h-10.5 cursor-pointer items-center justify-center rounded-md border border-transparent p-2 transition disabled:border-transparent disabled:bg-gray-400 disabled:shadow-none disabled:hover:bg-gray-400",
          className,
        )}
        disabled={loading === true || disabled}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner />
          </div>
        )}
        <div className={cn({ "opacity-0": loading })}>{children}</div>
      </button>
    </FluidComponent>
  );
}

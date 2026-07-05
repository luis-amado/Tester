import Link from "next/link";
import type { ComponentProps } from "react";

export default function MouseDownLink(props: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      onMouseDown={(e) => {
        if (e.button !== 0) return;
        if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) return;

        e.preventDefault();
        e.currentTarget.click();

        props.onMouseDown?.(e);
      }}
    />
  );
}

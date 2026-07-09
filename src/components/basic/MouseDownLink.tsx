import Link from "next/link";
import { useRef, type ComponentProps } from "react";

export default function MouseDownLink(props: ComponentProps<typeof Link>) {
  const shouldTrigger = useRef(false);

  return (
    <Link
      {...props}
      onMouseDown={(e) => {
        if (e.button !== 0) return;
        if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) return;

        e.preventDefault();
        shouldTrigger.current = true;
        e.currentTarget.click();

        props.onMouseDown?.(e);
      }}
      onClick={(e) => {
        if (shouldTrigger.current) {
          shouldTrigger.current = false;
          props.onClick?.(e);
          return;
        }
        e.preventDefault();
      }}
    />
  );
}

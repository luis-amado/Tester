import Link from "next/link";
import { useRef, type ComponentProps } from "react";

export default function MouseDownLink(props: ComponentProps<typeof Link>) {
  const shouldTrigger = useRef(true);

  return (
    <Link
      {...props}
      onMouseDown={(e) => {
        if (e.button !== 0) return;
        if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) return;

        e.preventDefault();
        e.currentTarget.click();
        shouldTrigger.current = false;

        props.onMouseDown?.(e);
      }}
      onClick={(e) => {
        if (shouldTrigger.current) {
          props.onClick?.(e);
          return;
        } else {
          shouldTrigger.current = true;
        }
        e.preventDefault();
      }}
    />
  );
}

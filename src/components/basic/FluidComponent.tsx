"use client";
import { useEffect, useRef, type ReactElement } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { ClassNameValue } from "tailwind-merge";
import { cn } from "~/lib/utils";

interface Props {
  maxStretchDistance?: number; // default 20
  maxStretchScale?: number; // default 0.1
  baseStretchScale?: number; // default 1.05
  children: ReactElement;
  className?: ClassNameValue;
  activeClassName?: ClassNameValue;
}

export default function FluidComponent({
  children,
  maxStretchDistance,
  maxStretchScale,
  baseStretchScale,
  className,
  activeClassName,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nonActiveClassName = useRef<string>("");

  const scaleXTarget = useMotionValue(1);
  const scaleYTarget = useMotionValue(1);

  const springConfig = { stiffness: 500, damping: 30 };
  const smoothScaleX = useSpring(scaleXTarget, springConfig);
  const smoothScaleY = useSpring(scaleYTarget, springConfig);

  const isPressed = useRef(false);

  // Refs to track time for the minimum duration logic
  const clickStartTime = useRef(0);
  const releaseTimeout = useRef<number | null>(null);

  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const container = containerRef.current;
    if (!container) return;
    const child = container.children[0];
    if (!child) return;

    const baseScale = baseStretchScale ?? 1.05;
    const maxExtraScale = maxStretchScale ?? 0.1;
    const maxTaper = maxStretchDistance ?? 50;
    const distanceSensitivity = 150;

    // The minimum time (in milliseconds) the stretch effect should last
    const minAnimationDuration = 150;

    const calculateScale = (x: number, y: number) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = Math.abs(x - centerX);
      const dy = Math.abs(y - centerY);

      const dynamicScaleX =
        baseScale + maxExtraScale * (1 - Math.exp(-dx / distanceSensitivity));
      const dynamicScaleY =
        baseScale + maxExtraScale * (1 - Math.exp(-dy / distanceSensitivity));

      scaleXTarget.set(dynamicScaleX);
      scaleYTarget.set(dynamicScaleY);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isPressed.current) {
        const rect = container.getBoundingClientRect();

        // --- 1. Origin Logic ---
        let xPercentage = ((e.clientX - rect.left) / rect.width) * 100;
        let yPercentage = ((e.clientY - rect.top) / rect.height) * 100;

        if (xPercentage > 100) {
          xPercentage =
            100 + maxTaper * (1 - Math.exp(-(xPercentage - 100) / maxTaper));
        } else if (xPercentage < 0) {
          xPercentage =
            -maxTaper * (1 - Math.exp(-Math.abs(xPercentage) / maxTaper));
        }

        if (yPercentage > 100) {
          yPercentage =
            100 + maxTaper * (1 - Math.exp(-(yPercentage - 100) / maxTaper));
        } else if (yPercentage < 0) {
          yPercentage =
            -maxTaper * (1 - Math.exp(-Math.abs(yPercentage) / maxTaper));
        }

        container.style.transformOrigin = `${100 - xPercentage}% ${100 - yPercentage}%`;

        // --- 2. Dynamic Scale Logic ---
        calculateScale(e.clientX, e.clientY);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      // If the user clicks again while a delayed release is pending, cancel the release
      if (releaseTimeout.current) {
        clearTimeout(releaseTimeout.current);
        releaseTimeout.current = null;
      }

      clickStartTime.current = Date.now();
      isPressed.current = true;

      handlePointerMove(e); // Ensure origin is calculated immediately

      if (nonActiveClassName.current == "") {
        nonActiveClassName.current = child.className;
      }
      child.className = cn(nonActiveClassName.current, activeClassName);
    };

    const triggerRelease = () => {
      scaleXTarget.set(1);
      scaleYTarget.set(1);

      if (nonActiveClassName.current != "") {
        child.className = nonActiveClassName.current;
      }
    };

    const handlePointerUp = () => {
      isPressed.current = false;

      const elapsedTime = Date.now() - clickStartTime.current;

      if (elapsedTime < minAnimationDuration) {
        // User clicked too fast. Wait for the remaining time before releasing.
        const remainingTime = minAnimationDuration - elapsedTime;
        releaseTimeout.current = window.setTimeout(
          triggerRelease,
          remainingTime,
        );
      } else {
        // User held it long enough. Release immediately.
        triggerRelease();
      }
    };

    (container.children[0] as HTMLElement).addEventListener(
      "pointerdown",
      handlePointerDown,
    );
    console.log(container.children[0]);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      if (releaseTimeout.current) clearTimeout(releaseTimeout.current);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      (container.children[0] as HTMLElement).removeEventListener(
        "pointerdown",
        handlePointerDown,
      );
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [
    scaleXTarget,
    scaleYTarget,
    baseStretchScale,
    maxStretchScale,
    maxStretchDistance,
    activeClassName,
    reducedMotion,
  ]);

  return (
    <motion.div
      ref={containerRef}
      style={{ scaleX: smoothScaleX, scaleY: smoothScaleY }}
      className={cn("h-fit w-fit touch-none select-none", className)}
    >
      {children}
    </motion.div>
  );
}

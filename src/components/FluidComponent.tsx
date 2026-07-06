import { useEffect, useRef, type PropsWithChildren } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface Props {
  maxStretchDistance?: number; // default 20
  maxStretchScale?: number; // default 0.1
  baseStretchScale?: number; // default 1.05
}

export default function FluidComponent({
  children,
  maxStretchDistance,
  maxStretchScale,
  baseStretchScale,
}: PropsWithChildren & Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scaleXTarget = useMotionValue(1);
  const scaleYTarget = useMotionValue(1);

  const springConfig = { stiffness: 500, damping: 30 };
  const smoothScaleX = useSpring(scaleXTarget, springConfig);
  const smoothScaleY = useSpring(scaleYTarget, springConfig);

  const isPressed = useRef(false);

  // Refs to track time for the minimum duration logic
  const clickStartTime = useRef(0);
  const releaseTimeout = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const container = containerRef.current;
    if (!container) return;

    const baseScale = baseStretchScale ?? 1.05;
    const maxExtraScale = maxStretchScale ?? 0.1;
    const maxTaper = maxStretchDistance ?? 20;
    const distanceSensitivity = 150;

    // The minimum time (in milliseconds) the stretch effect should last
    const minAnimationDuration = 200;

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
    };

    const triggerRelease = () => {
      scaleXTarget.set(1);
      scaleYTarget.set(1);
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

    container.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      if (releaseTimeout.current) clearTimeout(releaseTimeout.current);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      container.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [
    scaleXTarget,
    scaleYTarget,
    baseStretchScale,
    maxStretchScale,
    maxStretchDistance,
  ]);

  return (
    <motion.div
      ref={containerRef}
      style={{ scaleX: smoothScaleX, scaleY: smoothScaleY }}
      className="h-fit w-fit touch-none select-none"
    >
      {children}
    </motion.div>
  );
}

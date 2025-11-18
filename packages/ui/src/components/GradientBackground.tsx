/**
 * Gradient Background Component
 *
 * Linear 스타일의 그라데이션 배경
 * 동적인 블러 효과와 색상 글로우
 */

import React, { HTMLAttributes } from "react";
import { clsx } from "clsx";

export interface GradientBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "blue" | "purple" | "green" | "multi";
  intensity?: "subtle" | "medium" | "strong";
  animated?: boolean;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  variant = "blue",
  intensity = "medium",
  animated = false,
  className,
  ...props
}) => {
  const gradients = {
    blue: "from-blue-500/20 via-transparent to-transparent",
    purple: "from-purple-500/20 via-violet-500/10 to-transparent",
    green: "from-green-500/20 via-emerald-500/10 to-transparent",
    multi: "from-blue-500/20 via-purple-500/10 to-pink-500/20",
  };

  const intensityStyles = {
    subtle: "opacity-30",
    medium: "opacity-50",
    strong: "opacity-70",
  };

  return (
    <div
      className={clsx(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      {...props}
    >
      {/* 메인 그라데이션 */}
      <div
        className={clsx(
          "absolute -top-1/2 left-0 h-full w-full",
          "bg-gradient-to-br",
          gradients[variant],
          intensityStyles[intensity],
          animated && "animate-pulse"
        )}
        style={{
          filter: "blur(100px)",
        }}
      />

      {/* 세컨더리 글로우 */}
      <div
        className={clsx(
          "absolute top-1/4 right-0 h-96 w-96",
          "rounded-full",
          "bg-gradient-radial from-primary/20 to-transparent",
          intensityStyles[intensity]
        )}
        style={{
          filter: "blur(80px)",
        }}
      />

      {/* Grid Overlay (Linear 스타일) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          opacity: 0.05,
        }}
      />
    </div>
  );
};

export default GradientBackground;

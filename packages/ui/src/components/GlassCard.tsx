/**
 * Glass Card Component (글래스모피즘)
 *
 * Linear/Vercel 스타일의 반투명 카드
 * 배경 블러 효과와 미세한 테두리
 */

import React, { HTMLAttributes } from "react";
import { clsx } from "clsx";

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "strong";
  hover?: boolean;
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  variant = "default",
  hover = false,
  className,
  children,
  ...props
}) => {
  const variantStyles = {
    default: "glass",
    subtle: "bg-surface/50 backdrop-blur-sm border border-border/50",
    strong: "bg-surface/80 backdrop-blur-xl border border-border",
  };

  const hoverStyles = hover
    ? "hover-lift hover:shadow-elegant cursor-pointer"
    : "";

  return (
    <div
      className={clsx(
        "rounded-lg transition-all duration-200",
        variantStyles[variant],
        hoverStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;

/**
 * Bento Grid Component
 *
 * Apple/Linear 스타일의 격자 레이아웃
 * 다양한 크기의 카드를 아름답게 배치
 */

import React, { HTMLAttributes } from "react";
import { clsx } from "clsx";

export interface BentoGridProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  children,
  columns = 3,
  className,
  ...props
}) => {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div
      className={clsx(
        "grid gap-4 md:gap-6",
        gridCols[columns],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface BentoCardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  span?: "default" | "wide" | "tall" | "large";
  gradient?: boolean;
  hover?: boolean;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  span = "default",
  gradient = false,
  hover = true,
  className,
  ...props
}) => {
  const spanStyles = {
    default: "",
    wide: "md:col-span-2",
    tall: "md:row-span-2",
    large: "md:col-span-2 md:row-span-2",
  };

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-lg border border-border bg-surface p-6",
        "transition-all duration-300",
        hover && "hover-lift hover:border-border-hover hover:shadow-elegant",
        gradient && "gradient-glow",
        spanStyles[span],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

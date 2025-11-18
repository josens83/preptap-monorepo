/**
 * Shimmer Effect Component
 *
 * Stripe 스타일의 로딩 효과
 * 부드러운 빛 효과
 */

import React, { HTMLAttributes } from "react";
import { clsx } from "clsx";

export interface ShimmerProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  show?: boolean;
}

export const Shimmer: React.FC<ShimmerProps> = ({
  children,
  show = true,
  className,
  ...props
}) => {
  return (
    <div className={clsx("relative overflow-hidden", className)} {...props}>
      {children}

      {show && (
        <div
          className="absolute inset-0 -translate-x-full animate-shimmer"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
          }}
        />
      )}
    </div>
  );
};

export default Shimmer;

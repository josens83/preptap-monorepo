import React from "react";
import { clsx } from "clsx";

export interface ProgressProps {
  value: number; // 0-100
  max?: number;
  variant?: "default" | "success" | "warning" | "danger";
  showLabel?: boolean;
  className?: string;
}

export const Progress = ({
  value,
  max = 100,
  variant = "default",
  showLabel = false,
  className,
}: ProgressProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variantStyles = {
    default: "bg-primary-600",
    success: "bg-green-600",
    warning: "bg-yellow-600",
    danger: "bg-red-600",
  };

  return (
    <div className={clsx("w-full", className)}>
      <div className="flex items-center justify-between mb-1">
        {showLabel && <span className="text-sm font-medium text-gray-700">{value}%</span>}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={clsx("h-full rounded-full transition-all duration-300", variantStyles[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

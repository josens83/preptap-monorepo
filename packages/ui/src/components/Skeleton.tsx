import React from "react";
import { clsx } from "clsx";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "text",
  width,
  height,
  className,
  ...props
}) => {
  const variantStyles = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const defaultHeight = {
    text: "1rem",
    circular: "3rem",
    rectangular: "8rem",
  };

  const style: React.CSSProperties = {
    width: width || (variant === "circular" ? "3rem" : "100%"),
    height: height || defaultHeight[variant],
  };

  return (
    <div
      className={clsx(
        "animate-pulse bg-gray-200",
        variantStyles[variant],
        className
      )}
      style={style}
      {...props}
    />
  );
};

export interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  className,
}) => {
  return (
    <div className={clsx("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={index === lines - 1 ? "80%" : "100%"}
        />
      ))}
    </div>
  );
};

export interface SkeletonCardProps {
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className }) => {
  return (
    <div
      className={clsx(
        "bg-white rounded-lg border border-gray-200 p-6 space-y-4",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width="3rem" height="3rem" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <SkeletonText lines={3} />
      <div className="flex gap-2 pt-2">
        <Skeleton variant="rectangular" width="5rem" height="2.5rem" />
        <Skeleton variant="rectangular" width="5rem" height="2.5rem" />
      </div>
    </div>
  );
};

export interface SkeletonListProps {
  items?: number;
  className?: string;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({
  items = 5,
  className,
}) => {
  return (
    <div className={clsx("space-y-3", className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-gray-200 p-4"
        >
          <div className="flex items-center gap-3">
            <Skeleton variant="circular" width="2.5rem" height="2.5rem" />
            <div className="flex-1">
              <Skeleton variant="text" width="70%" className="mb-2" />
              <Skeleton variant="text" width="40%" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

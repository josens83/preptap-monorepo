import React from "react";
import { clsx } from "clsx";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "bordered" | "elevated";
}

export const Card = ({ children, variant = "default", className, ...props }: CardProps) => {
  const variantStyles = {
    default: "bg-white",
    bordered: "bg-white border border-gray-200",
    elevated: "bg-white shadow-md",
  };

  return (
    <div className={clsx("rounded-lg p-6", variantStyles[variant], className)} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={clsx("mb-4", className)} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h3 className={clsx("text-xl font-semibold text-gray-900", className)} {...props}>
      {children}
    </h3>
  );
};

export const CardContent = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={clsx("text-gray-700", className)} {...props}>
      {children}
    </div>
  );
};

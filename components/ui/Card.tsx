import { HTMLAttributes } from "react";

export function Card({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-3xl bg-surface border border-border p-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary: "bg-accent-strong text-black hover:bg-accent active:scale-[0.98]",
  secondary: "bg-surface-raised text-foreground border border-border hover:bg-border/60 active:scale-[0.98]",
  ghost: "bg-transparent text-muted hover:text-foreground",
  danger: "bg-danger/15 text-danger border border-danger/40 hover:bg-danger/25",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-base font-semibold transition disabled:opacity-40 disabled:pointer-events-none ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

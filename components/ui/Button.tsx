import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "text-white bg-[linear-gradient(180deg,#3a9bff_0%,#0055cc_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.3),var(--shadow-glow-cyan)] hover:brightness-110 active:scale-[0.98]",
  secondary:
    "bg-surface-raised text-foreground border border-border shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-border/60 active:scale-[0.98]",
  ghost: "bg-transparent text-muted hover:text-foreground",
  danger:
    "text-white bg-[linear-gradient(180deg,#ff7a90_0%,#c2003a_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.3),var(--shadow-glow-danger)] hover:brightness-110 active:scale-[0.98]",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-base font-bold uppercase tracking-wide transition disabled:opacity-40 disabled:pointer-events-none ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

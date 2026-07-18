import { InputHTMLAttributes } from "react";

type NumberFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type"> & {
  value: number | null;
  onChange: (value: number | null) => void;
  label?: string;
};

export function NumberField({ value, onChange, label, className = "", ...props }: NumberFieldProps) {
  return (
    <label className="flex flex-col gap-1">
      {label && <span className="text-xs font-medium text-muted uppercase tracking-wide">{label}</span>}
      <input
        type="number"
        inputMode="decimal"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
        className={`w-full rounded-xl bg-surface-raised border border-border px-3 py-2.5 text-lg font-semibold text-center focus:outline-none focus:border-accent-strong ${className}`}
        {...props}
      />
    </label>
  );
}

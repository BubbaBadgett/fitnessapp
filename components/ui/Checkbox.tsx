export function Checkbox({
  checked,
  onChange,
  size = "md",
}: {
  checked: boolean;
  onChange: () => void;
  size?: "md" | "lg";
}) {
  const dim = size === "lg" ? "h-8 w-8" : "h-6 w-6";
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className={`${dim} shrink-0 rounded-lg border-2 flex items-center justify-center transition ${
        checked ? "bg-accent-strong border-accent-strong" : "border-border bg-transparent"
      }`}
    >
      {checked && (
        <svg viewBox="0 0 24 24" fill="none" className="h-4/5 w-4/5">
          <path
            d="M5 13l4 4L19 7"
            stroke="#0a0a0f"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

import { cn } from "@/lib/cn";

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: React.ReactNode;
  error?: string;
}

export function Checkbox({ label, error, id, name, className, ...rest }: Props) {
  const fieldId = id ?? name ?? "checkbox";
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label htmlFor={fieldId} className="inline-flex cursor-pointer items-start gap-3 text-sm text-ink">
        <input
          id={fieldId}
          name={name}
          type="checkbox"
          aria-invalid={!!error || undefined}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className="mt-0.5 size-4.5 shrink-0 cursor-pointer rounded accent-ink"
          {...rest}
        />
        <span>{label}</span>
      </label>
      {error && (
        <p id={`${fieldId}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { describedBy, FieldWrapper } from "./FieldWrapper";
import { fieldBase, fieldBorder } from "./field";

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  wrapperClassName?: string;
}

export function Select({ label, error, hint, options, placeholder, id, name, className, wrapperClassName, required, ...rest }: Props) {
  const fieldId = id ?? name ?? label ?? "select";
  return (
    <FieldWrapper id={fieldId} label={label} error={error} hint={hint} required={required} className={wrapperClassName}>
      <div className="relative">
        <select
          id={fieldId}
          name={name}
          required={required}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy(fieldId, error, hint)}
          className={cn(fieldBase, fieldBorder(error), "h-12 cursor-pointer appearance-none pr-10", className)}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden />
      </div>
    </FieldWrapper>
  );
}

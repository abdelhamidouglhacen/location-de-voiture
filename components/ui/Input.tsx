import { cn } from "@/lib/cn";
import { describedBy, FieldWrapper } from "./FieldWrapper";
import { fieldBase, fieldBorder } from "./field";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  wrapperClassName?: string;
}

export function Input({ label, error, hint, icon, id, name, className, wrapperClassName, required, ...rest }: Props) {
  const fieldId = id ?? name ?? label ?? "field";
  return (
    <FieldWrapper id={fieldId} label={label} error={error} hint={hint} required={required} className={wrapperClassName}>
      <div className="relative">
        {icon && <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted">{icon}</span>}
        <input
          id={fieldId}
          name={name}
          required={required}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy(fieldId, error, hint)}
          className={cn(fieldBase, fieldBorder(error), "h-12", !!icon && "pl-10", className)}
          {...rest}
        />
      </div>
    </FieldWrapper>
  );
}

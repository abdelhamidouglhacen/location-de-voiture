import { cn } from "@/lib/cn";
import { describedBy, FieldWrapper } from "./FieldWrapper";
import { fieldBase, fieldBorder } from "./field";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export function Textarea({ label, error, hint, id, name, className, wrapperClassName, required, rows = 4, ...rest }: Props) {
  const fieldId = id ?? name ?? label ?? "textarea";
  return (
    <FieldWrapper id={fieldId} label={label} error={error} hint={hint} required={required} className={wrapperClassName}>
      <textarea
        id={fieldId}
        name={name}
        rows={rows}
        required={required}
        aria-invalid={!!error || undefined}
        aria-describedby={describedBy(fieldId, error, hint)}
        className={cn(fieldBase, fieldBorder(error), "resize-y py-3", className)}
        {...rest}
      />
    </FieldWrapper>
  );
}

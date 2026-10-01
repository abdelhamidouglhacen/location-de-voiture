export type Errors<T> = Partial<Record<keyof T, string>>;

export function required(value: string, label = "This field") {
  return value.trim() ? undefined : `${label} is required.`;
}

export function email(value: string) {
  if (!value.trim()) return "Email address is required.";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? undefined : "Invalid email address.";
}

/** Accepts 06/07 + 8 digits, or +212 6/7 + 8 digits (spaces allowed). */
export function phone(value: string) {
  const v = value.replace(/[\s.-]/g, "");
  if (!v) return "Phone number is required.";
  return /^(0[67]\d{8}|\+212[67]\d{8})$/.test(v)
    ? undefined
    : "Invalid number. Example: 06 12 34 56 78 or +212 6 12 34 56 78.";
}

export function minAge(value: string, min = 21) {
  const age = Number(value);
  if (!value.trim()) return "Age is required.";
  if (!Number.isInteger(age) || age <= 0) return "Invalid age.";
  return age >= min ? undefined : `You must be at least ${min} years old.`;
}

export function minLength(value: string, min: number, label = "This field") {
  return value.trim().length >= min ? undefined : `${label} must be at least ${min} characters long.`;
}

export function hasErrors<T>(errors: Errors<T>) {
  return Object.values(errors).some(Boolean);
}

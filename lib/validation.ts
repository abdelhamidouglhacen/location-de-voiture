export type Errors<T> = Partial<Record<keyof T, string>>;

export function required(value: string, label = "Ce champ") {
  return value.trim() ? undefined : `${label} est obligatoire.`;
}

export function email(value: string) {
  if (!value.trim()) return "L'adresse e-mail est obligatoire.";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? undefined : "Adresse e-mail invalide.";
}

/** Accepts 06/07 + 8 digits, or +212 6/7 + 8 digits (spaces allowed). */
export function phone(value: string) {
  const v = value.replace(/[\s.-]/g, "");
  if (!v) return "Le numéro de téléphone est obligatoire.";
  return /^(0[67]\d{8}|\+212[67]\d{8})$/.test(v)
    ? undefined
    : "Numéro invalide. Exemple : 06 12 34 56 78 ou +212 6 12 34 56 78.";
}

export function minAge(value: string, min = 21) {
  const age = Number(value);
  if (!value.trim()) return "L'âge est obligatoire.";
  if (!Number.isInteger(age) || age <= 0) return "Âge invalide.";
  return age >= min ? undefined : `Vous devez avoir au moins ${min} ans.`;
}

export function minLength(value: string, min: number, label = "Ce champ") {
  return value.trim().length >= min ? undefined : `${label} doit contenir au moins ${min} caractères.`;
}

export function hasErrors<T>(errors: Errors<T>) {
  return Object.values(errors).some(Boolean);
}

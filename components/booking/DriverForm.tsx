import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { email, minAge, minLength, phone, required, type Errors } from "@/lib/validation";
import type { DriverInfo } from "@/types";

interface Props {
  value: DriverInfo;
  errors: Errors<DriverInfo>;
  onChange: (patch: Partial<DriverInfo>) => void;
}

export function DriverForm({ value, errors, onChange }: Props) {
  const field = (name: keyof DriverInfo) => ({
    id: `conducteur-${name}`,
    name,
    value: value[name],
    error: errors[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange({ [name]: e.target.value }),
  });

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Input {...field("nomComplet")} label="Nom complet" autoComplete="name" required wrapperClassName="sm:col-span-2" />
      <Input {...field("email")} label="E-mail" type="email" autoComplete="email" required />
      <Input {...field("telephone")} label="Téléphone" type="tel" autoComplete="tel" placeholder="06 12 34 56 78" required />
      <Input {...field("age")} label="Âge" type="number" inputMode="numeric" min={18} max={99} hint="21 ans minimum." required />
      <Input {...field("pieceIdentite")} label="CIN ou passeport" placeholder="Ex : JB412867" required />
      <Input {...field("numeroPermis")} label="Numéro de permis" required />
      <Input {...field("expirationPermis")} label="Expiration du permis" type="date" required />
      <Input {...field("numeroVol")} label="Numéro de vol (optionnel)" placeholder="Ex : AT 412" hint="Utile si nous vous livrons à l'aéroport." wrapperClassName="sm:col-span-2" />
      <Textarea {...field("remarques")} label="Remarques (optionnel)" placeholder="Heure d'arrivée, nom de l'hôtel, demande particulière…" wrapperClassName="sm:col-span-2" rows={3} />
    </div>
  );
}

export function validateDriver(d: DriverInfo): Errors<DriverInfo> {
  const expired = d.expirationPermis && new Date(d.expirationPermis) < new Date();
  return {
    nomComplet: required(d.nomComplet, "Le nom complet") ?? minLength(d.nomComplet, 3, "Le nom complet"),
    email: email(d.email),
    telephone: phone(d.telephone),
    age: minAge(d.age, 21),
    pieceIdentite: required(d.pieceIdentite, "Le numéro de CIN ou de passeport"),
    numeroPermis: required(d.numeroPermis, "Le numéro de permis"),
    expirationPermis: required(d.expirationPermis, "La date d'expiration") ?? (expired ? "Votre permis est expiré." : undefined),
  };
}

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
      <Input {...field("nomComplet")} label="Full name" autoComplete="name" required wrapperClassName="sm:col-span-2" />
      <Input {...field("email")} label="Email" type="email" autoComplete="email" required />
      <Input {...field("telephone")} label="Phone" type="tel" autoComplete="tel" placeholder="06 12 34 56 78" required />
      <Input {...field("age")} label="Age" type="number" inputMode="numeric" min={18} max={99} hint="21 years minimum." required />
      <Input {...field("pieceIdentite")} label="ID card or passport" placeholder="E.g. JB412867" required />
      <Input {...field("numeroPermis")} label="Licence number" required />
      <Input {...field("expirationPermis")} label="Licence expiry date" type="date" required />
      <Input {...field("numeroVol")} label="Flight number (optional)" placeholder="E.g. AT 412" hint="Useful if we deliver to you at the airport." wrapperClassName="sm:col-span-2" />
      <Textarea {...field("remarques")} label="Notes (optional)" placeholder="Arrival time, hotel name, special request…" wrapperClassName="sm:col-span-2" rows={3} />
    </div>
  );
}

export function validateDriver(d: DriverInfo): Errors<DriverInfo> {
  const expired = d.expirationPermis && new Date(d.expirationPermis) < new Date();
  return {
    nomComplet: required(d.nomComplet, "Full name") ?? minLength(d.nomComplet, 3, "Full name"),
    email: email(d.email),
    telephone: phone(d.telephone),
    age: minAge(d.age, 21),
    pieceIdentite: required(d.pieceIdentite, "ID card or passport number"),
    numeroPermis: required(d.numeroPermis, "Licence number"),
    expirationPermis: required(d.expirationPermis, "Expiry date") ?? (expired ? "Your licence has expired." : undefined),
  };
}

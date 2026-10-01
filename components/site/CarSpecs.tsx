import { Cog, Fuel, Snowflake, Users } from "lucide-react";
import type { Car } from "@/types";

export function CarSpecs({ car }: { car: Car }) {
  const specs = [
    { Icon: Users, label: `${car.places} seats` },
    { Icon: Cog, label: car.boite },
    { Icon: Fuel, label: car.carburant },
    ...(car.climatisation ? [{ Icon: Snowflake, label: "A/C" }] : []),
  ];
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-muted">
      {specs.map(({ Icon, label }) => (
        <li key={label} className="inline-flex items-center gap-1.5">
          <Icon className="size-3.5" strokeWidth={1.75} aria-hidden />
          {label}
        </li>
      ))}
    </ul>
  );
}

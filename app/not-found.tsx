import { LogoMark } from "@/components/site/Logo";
import { Button } from "@/components/ui/Button";
import { BUSINESS } from "@/lib/constants";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-4 text-center">
      <div>
        <LogoMark size={72} className="mx-auto" />
        <p className="mt-10 font-display text-7xl font-semibold tracking-[-0.04em] text-accent sm:text-8xl">404</p>
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight sm:text-3xl">Cette page a pris une autre route</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">La page que vous cherchez n&apos;existe pas ou a été déplacée.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/">Retour à l&apos;accueil</Button>
          <Button href="/voitures" variant="outline">
            Voir nos voitures
          </Button>
        </div>
        <p className="mt-10 text-sm text-muted tabular-nums">Besoin d&apos;aide ? {BUSINESS.phones[0].label}</p>
      </div>
    </main>
  );
}

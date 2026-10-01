import { LogoMark } from "@/components/site/Logo";
import { Button } from "@/components/ui/Button";
import { BUSINESS } from "@/lib/constants";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-4 text-center">
      <div>
        <LogoMark size={72} className="mx-auto" />
        <p className="mt-10 font-display text-7xl font-semibold tracking-[-0.04em] text-accent sm:text-8xl">404</p>
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight sm:text-3xl">This page took another road</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">The page you are looking for does not exist or has been moved.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/">Back to home</Button>
          <Button href="/voitures" variant="outline">
            See our cars
          </Button>
        </div>
        <p className="mt-10 text-sm text-muted tabular-nums">Need help? {BUSINESS.phones[0].label}</p>
      </div>
    </main>
  );
}

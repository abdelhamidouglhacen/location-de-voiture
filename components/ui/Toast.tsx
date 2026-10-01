"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { createContext, useCallback, useContext, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

type Tone = "success" | "error" | "info";
interface ToastItem {
  id: number;
  message: string;
  tone: Tone;
}

const ToastContext = createContext<((message: string, tone?: Tone) => void) | null>(null);

const icons = {
  success: <CheckCircle2 className="size-5 text-emerald-600" aria-hidden />,
  error: <XCircle className="size-5 text-red-600" aria-hidden />,
  info: <Info className="size-5 text-accent-deep" aria-hidden />,
};

function ToastView({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from(ref.current, { x: 40, autoAlpha: 0, duration: 0.45 });
      });
    },
    { scope: ref },
  );
  return (
    <div
      ref={ref}
      role={toast.tone === "error" ? "alert" : "status"}
      className="pointer-events-auto flex w-full items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-ink shadow-lift sm:w-80"
    >
      {icons[toast.tone]}
      <p className="flex-1">{toast.message}</p>
      <button type="button" onClick={onClose} className="rounded p-1 text-muted hover:text-ink" aria-label="Fermer la notification">
        <X className="size-4" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const show = useCallback(
    (message: string, tone: Tone = "success") => {
      const id = ++nextId.current;
      setToasts((t) => [...t.slice(-3), { id, message, tone }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className={cn("pointer-events-none fixed top-4 right-4 left-4 z-[80] flex flex-col items-end gap-2 sm:left-auto")} aria-live="polite">
        {toasts.map((t) => (
          <ToastView key={t.id} toast={t} onClose={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast doit être utilisé dans <ToastProvider>.");
  return ctx;
}

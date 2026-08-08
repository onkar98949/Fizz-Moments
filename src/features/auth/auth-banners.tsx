import { AlertCircle, CheckCircle2 } from "lucide-react";

export function AuthErrorBanner({ message }: { message: string }) {
  return (
    <div className="border-destructive/20 bg-destructive/5 text-destructive flex items-start gap-2.5 rounded-xl border p-3.5 text-sm">
      <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
      <p>{message}</p>
    </div>
  );
}

export function AuthSuccessBanner({ message }: { message: string }) {
  return (
    <div className="border-primary/25 bg-accent text-primary-active flex items-start gap-2.5 rounded-xl border p-3.5 text-sm">
      <CheckCircle2 className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
      <p>{message}</p>
    </div>
  );
}

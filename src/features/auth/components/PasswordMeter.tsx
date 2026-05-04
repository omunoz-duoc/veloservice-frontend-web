import { cn } from "@/lib/utils";

export function getPasswordScore(pwd: string): number {
  if (pwd.length < 10) return 0;
  let score = 1; // length >= 10
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}

const LABELS = ["Muy débil", "Débil", "Aceptable", "Buena", "Excelente"];
const COLORS = ["#c85a2a", "#c85a2a", "#d4a017", "#3a6ea5", "#2f7d4f"];
const WIDTHS = ["8%", "30%", "55%", "80%", "100%"];

function Rule({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={cn(
        "px-1.5 py-0.5 rounded font-mono text-[10.5px]",
        ok ? "bg-vs-good-bg text-vs-good" : "bg-vs-chip text-[#a59682]"
      )}
    >
      {label}
    </span>
  );
}

export function PasswordMeter({ password }: { password: string }) {
  const score = getPasswordScore(password);
  return (
    <div>
      <div className="h-1 rounded-full bg-[#e9e0d2] overflow-hidden">
        <span
          className="block h-full rounded-full transition-all duration-300"
          style={{
            width: password ? WIDTHS[score] : "0%",
            background: COLORS[score],
          }}
        />
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <span
          className="text-[11px]"
          style={{ color: password ? COLORS[score] : "#a59682" }}
        >
          {password ? LABELS[score] : "Ingresa una contraseña"}
        </span>
        <div className="flex gap-1.5">
          <Rule ok={password.length >= 10} label="10+" />
          <Rule ok={/[A-Z]/.test(password)} label="ABC" />
          <Rule ok={/[0-9]/.test(password)} label="123" />
          <Rule ok={/[^A-Za-z0-9]/.test(password)} label="@#&" />
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";

interface LogoProps {
  inverted?: boolean;
  className?: string;
}

export function Logo({ inverted = false, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: inverted ? "transparent" : "#111418",
          border: inverted ? "1px solid rgba(255,255,255,.18)" : "none",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f3ede6"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <circle cx="6" cy="16" r="4" />
          <circle cx="18" cy="16" r="4" />
          <path d="M6 16 10 7h5l3 9" />
        </svg>
      </div>
      <div>
        <div
          className={cn(
            "text-[16px] font-extrabold tracking-tight leading-none",
            inverted ? "text-white" : "text-vs-ink"
          )}
        >
          VELOSERVICE
        </div>
        <div
          className={cn(
            "text-[11px] mt-1",
            inverted ? "text-white/55" : "text-[#8a7f70]"
          )}
        >
          Taller de bicicletas · Panel
        </div>
      </div>
    </div>
  );
}

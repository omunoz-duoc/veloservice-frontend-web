import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: number;
  current: number;
}

export function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: steps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center gap-1.5 flex-1">
          <span
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0",
              current > step
                ? "bg-vs-good text-white"
                : current === step
                ? "bg-vs-ink text-white"
                : "bg-vs-chip text-[#a59682]"
            )}
          >
            {current > step ? <Check size={12} /> : step}
          </span>
          {step < steps && (
            <div className="flex-1 h-1 rounded-full overflow-hidden bg-vs-chip">
              <div
                className="h-full bg-vs-ink transition-all"
                style={{ width: current > step ? "100%" : "0%" }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

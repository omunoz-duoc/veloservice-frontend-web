import { cn } from "@/lib/utils";

interface FieldProps {
  icon?: React.ReactNode;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  error?: string;
  autoFocus?: boolean;
  suffix?: React.ReactNode;
  id?: string;
}

export function Field({
  icon,
  type = "text",
  placeholder,
  value,
  onChange,
  hint,
  error,
  autoFocus,
  suffix,
  id,
}: FieldProps) {
  return (
    <div>
      <div
        className={cn(
          "bg-[#f7f3eb] border border-vs-line-2 rounded-[14px] px-[14px] py-3 flex items-center gap-2.5",
          "transition-colors duration-150 focus-within:border-vs-ink focus-within:bg-white",
          error && "border-vs-warn"
        )}
      >
        {icon && <span className="text-[#a59682] flex-shrink-0">{icon}</span>}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus={autoFocus}
          className="bg-transparent outline-none flex-1 text-[14px] text-vs-ink placeholder:text-[#a59682] min-w-0"
        />
        {suffix}
      </div>
      {hint && !error && (
        <div className="text-[11px] text-[#a59682] mt-1.5 ml-1">{hint}</div>
      )}
      {error && (
        <div className="text-[11px] text-vs-warn mt-1.5 ml-1">{error}</div>
      )}
    </div>
  );
}

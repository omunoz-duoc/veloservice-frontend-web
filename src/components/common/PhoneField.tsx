"use client";

import { useState, useRef } from "react";
import { defaultCountries, FlagImage, parseCountry, usePhoneInput } from "react-international-phone";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/lib/hooks/use-click-outside";

interface PhoneFieldProps {
  value: string;
  onChange: (value: string) => void;
  defaultCountry?: string;
  placeholder?: string;
  autoFocus?: boolean;
  error?: string;
}

export function PhoneField({
  value,
  onChange,
  defaultCountry = "cl",
  placeholder = "Teléfono",
  autoFocus,
  error,
}: PhoneFieldProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry,
      value,
      countries: defaultCountries,
      onChange: (data) => onChange(data.phone),
    });

  useClickOutside(containerRef, () => setOpen(false), open);

  return (
    <div ref={containerRef} className="relative">
      <div className={cn(
        "bg-[#f7f3eb] border border-vs-line-2 rounded-[14px] px-[14px] py-3 flex items-center gap-2.5 transition-colors duration-150 focus-within:border-vs-ink focus-within:bg-white",
        error && "border-vs-warn"
      )}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1 flex-shrink-0 text-[#a59682] hover:text-vs-ink transition-colors"
        >
          <FlagImage iso2={country.iso2} style={{ width: 20, height: 14 }} />
          <ChevronDown
            size={12}
            className={cn("transition-transform duration-150", open && "rotate-180")}
          />
        </button>
        <span className="w-px h-4 bg-vs-line-2 flex-shrink-0" />
        <input
          ref={inputRef}
          type="tel"
          value={inputValue}
          onChange={handlePhoneValueChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="bg-transparent outline-none flex-1 text-[14px] text-vs-ink placeholder:text-[#a59682] min-w-0"
        />
      </div>

      {error && (
        <div className="text-[11px] text-vs-warn mt-1.5 ml-1">{error}</div>
      )}
      {open && (
        <div className="absolute z-50 top-full mt-1.5 w-full bg-white border border-vs-line-2 rounded-[14px] shadow-lg overflow-hidden">
          <div className="max-h-[240px] overflow-y-auto py-1">
            {defaultCountries.map((c) => {
              const parsed = parseCountry(c);
              return (
                <button
                  key={parsed.iso2}
                  type="button"
                  onClick={() => {
                    setCountry(parsed.iso2);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-vs-ink hover:bg-[#f7f3eb] transition-colors text-left",
                    country.iso2 === parsed.iso2 && "bg-[#f7f3eb] font-medium"
                  )}
                >
                  <FlagImage iso2={parsed.iso2} style={{ width: 20, height: 14, flexShrink: 0 }} />
                  <span className="flex-1 truncate">{parsed.name}</span>
                  <span className="text-[#a59682] text-[12px]">+{parsed.dialCode}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

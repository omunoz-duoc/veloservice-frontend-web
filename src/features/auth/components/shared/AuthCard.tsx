import { cn } from "@/lib/utils";

export function AuthCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-vs-card border border-vs-line rounded-3xl p-7 lg:p-8 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

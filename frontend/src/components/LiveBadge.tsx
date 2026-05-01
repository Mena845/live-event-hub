import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  size?: "sm" | "md";
}

export function LiveBadge({ className, size = "sm" }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-gradient-live text-live-foreground font-display font-semibold uppercase tracking-wider live-pulse",
        size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-3 py-1",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-live-foreground live-dot" />
      Live
    </span>
  );
}
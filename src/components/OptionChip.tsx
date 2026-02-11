import { cn } from "@/lib/utils";

interface OptionChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function OptionChip({ label, selected, onClick }: OptionChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border",
        selected
          ? "bg-primary/20 border-primary text-primary glow-border"
          : "bg-secondary/50 border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

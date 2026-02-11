import { OptionChip } from "./OptionChip";

interface OptionSectionProps {
  title: string;
  options: readonly string[];
  selected: string;
  onSelect: (value: string) => void;
}

export function OptionSection({ title, options, selected, onSelect }: OptionSectionProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        {title}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <OptionChip
            key={opt}
            label={opt}
            selected={selected === opt}
            onClick={() => onSelect(selected === opt ? "" : opt)}
          />
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface PromptDisplayProps {
  prompt: string;
  isLoading: boolean;
  onEdit: (value: string) => void;
}

export function PromptDisplay({ prompt, isLoading, onEdit }: PromptDisplayProps) {
  const [copied, setCopied] = useState(false);

  if (!prompt && !isLoading) return null;

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="glass rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-primary uppercase tracking-wider">
          Edit Prompt
        </label>
        {prompt && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
      {isLoading ? (
        <div className="h-20 rounded-lg bg-secondary/50 animate-pulse" />
      ) : (
        <textarea
          value={prompt}
          onChange={(e) => onEdit(e.target.value)}
          rows={4}
          className="w-full bg-background/50 rounded-lg p-3 text-sm font-mono text-foreground border border-border/50 resize-none focus:outline-none focus:ring-1 focus:ring-primary/50"
          placeholder="Edit the prompt before regenerating..."
        />
      )}
    </div>
  );
}

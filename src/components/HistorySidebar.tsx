import { useEffect, useState } from "react";
import { History, X, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Generation {
  id: string;
  description: string;
  prompt: string;
  image_url: string | null;
  style: string | null;
  mood: string | null;
  created_at: string;
}

interface HistorySidebarProps {
  open: boolean;
  onClose: () => void;
  onSelect: (gen: Generation) => void;
}

export function HistorySidebar({ open, onClose, onSelect }: HistorySidebarProps) {
  const { user } = useAuth();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !open) return;
    setLoading(true);
    supabase
      .from("generations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setGenerations((data as Generation[]) || []);
        setLoading(false);
      });
  }, [user, open]);

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <div
        className={`fixed top-0 left-0 h-full w-80 z-40 bg-card/95 backdrop-blur-xl border-r border-border/50 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">History</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-57px)] p-3 space-y-2">
          {!user && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Sign in to see your history
            </p>
          )}

          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-lg bg-secondary/50 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && user && generations.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No generations yet. Create your first image!
            </p>
          )}

          {generations.map((gen) => (
            <button
              key={gen.id}
              onClick={() => {
                onSelect(gen);
                onClose();
              }}
              className="w-full text-left p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 border border-border/30 transition-all group"
            >
              <div className="flex gap-3">
                {gen.image_url ? (
                  <img
                    src={gen.image_url}
                    alt=""
                    className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground truncate">
                    {gen.description || gen.prompt.slice(0, 60)}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {gen.style && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                        {gen.style}
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(gen.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

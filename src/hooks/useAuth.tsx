import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

/**
 * SECURITY: Single account access control
 *
 * Priority order for ALLOWED_EMAIL:
 * 1. Environment variable: VITE_ALLOWED_EMAIL (production)
 * 2. Hardcoded fallback (development)
 *
 * IMPORTANT: Set VITE_ALLOWED_EMAIL in your hosting platform
 */
const ALLOWED_EMAIL = import.meta.env.VITE_ALLOWED_EMAIL || "your-email@example.com";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthorized: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Sign in with email whitelist validation
   * Only allows the pre-configured email to access the application
   */
  const signIn = async (email: string, password: string) => {
    // SECURITY: Check if email matches the allowed account
    if (email !== ALLOWED_EMAIL) {
      return { error: "Access denied. This account is not authorized." };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  /**
   * Sign out current user
   */
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  /**
   * Check if current user is the authorized account
   * Compares user email against allowed email whitelist
   */
  const isAuthorized = user?.email === ALLOWED_EMAIL;

  return (
    <AuthContext.Provider value={{ user, session, loading, isAuthorized, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access authentication context
 * Provides user state, auth methods, and authorization status
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

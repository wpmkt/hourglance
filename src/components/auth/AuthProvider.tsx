import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { QueryClient } from "@tanstack/react-query";

interface AuthProviderProps {
  children: React.ReactNode;
  queryClient: QueryClient;
}

export const AuthProvider = ({ children, queryClient }: AuthProviderProps) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
      } catch (error) {
        console.error("Erro ao buscar sessão:", error);
        toast({
          variant: "destructive",
          title: "Erro ao verificar sessão",
          description: "Por favor, tente novamente."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (!session) {
        queryClient.clear();
      }
    });

    return () => subscription.unsubscribe();
  }, [toast, queryClient]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return <>{children}</>;
};
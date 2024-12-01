import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Account = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { data: subscription, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Minha Conta</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Assinatura</CardTitle>
              <CardDescription>Gerencie sua assinatura atual</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingSubscription ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : subscription?.stripe_subscription_id ? (
                <div className="space-y-4">
                  <p className="text-sm text-neutral-600">
                    Você tem uma assinatura ativa.
                  </p>
                  <Button onClick={() => navigate("/subscription")}>
                    Gerenciar Assinatura
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-neutral-600">
                    Você não tem uma assinatura ativa.
                  </p>
                  <Button onClick={() => navigate("/subscription")}>
                    Assinar Agora
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conta</CardTitle>
              <CardDescription>Gerencie sua conta</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Sair
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
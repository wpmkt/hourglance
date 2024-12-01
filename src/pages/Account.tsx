import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2, CreditCard, LogOut, Settings, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Minha Conta</h1>
          <p className="text-muted-foreground">
            Gerencie suas configurações e preferências.
          </p>
        </div>
        
        <Separator />
        
        <div className="grid gap-6">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <CardTitle>Perfil</CardTitle>
              </div>
              <CardDescription>
                Suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <CardTitle>Assinatura</CardTitle>
              </div>
              <CardDescription>
                Gerencie sua assinatura atual
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingSubscription ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : subscription?.stripe_subscription_id ? (
                <div className="space-y-4">
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <p className="text-sm font-medium">Assinatura Ativa</p>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Sua assinatura está ativa e você tem acesso a todos os recursos.
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto"
                    onClick={() => navigate("/subscription")}
                  >
                    Gerenciar Assinatura
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-yellow-500" />
                      <p className="text-sm font-medium">Sem Assinatura Ativa</p>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Você não tem uma assinatura ativa. Assine agora para acessar todos os recursos.
                    </p>
                  </div>
                  <Button 
                    className="w-full sm:w-auto"
                    onClick={() => navigate("/subscription")}
                  >
                    Assinar Agora
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <CardTitle>Configurações da Conta</CardTitle>
              </div>
              <CardDescription>
                Gerencie suas preferências
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <LogOut className="h-4 w-4 mr-2" />
                )}
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
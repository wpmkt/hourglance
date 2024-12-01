import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface PlanCardProps {
  userId: string;
}

export function PlanCard({ userId }: PlanCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          userId,
          priceId: 'price_1QPiphE1aaa3UksGw80nrYee'
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de checkout não recebida');
      }
    } catch (error) {
      console.error('Erro ao iniciar checkout:', error);
      toast({
        variant: "destructive",
        title: "Erro ao iniciar checkout",
        description: "Não foi possível iniciar o processo de assinatura. Tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Plano Premium</CardTitle>
        <CardDescription>Acesso a todos os recursos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-2xl font-bold">R$ 29,90/mês</p>
          <ul className="space-y-2">
            <li className="flex items-center">
              ✓ Recursos ilimitados
            </li>
            <li className="flex items-center">
              ✓ Suporte prioritário
            </li>
            <li className="flex items-center">
              ✓ Acesso antecipado a novidades
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSubscribe}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            'Assinar agora'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
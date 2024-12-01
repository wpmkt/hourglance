import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";

interface PlanCardProps {
  userId: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  default_price: {
    id: string;
    unit_amount: number;
    currency: string;
  };
}

const stripePromise = loadStripe("pk_test_51QPiphE1aaa3UksGXXXXXXXXXXXXXXXXXXXXXXXXXXXX"); // Substitua pela sua chave pública do Stripe

export function PlanCard({ userId }: PlanCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-products');
      
      if (error) throw error;
      
      if (data?.products) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar produtos",
        description: "Não foi possível carregar os planos disponíveis."
      });
    }
  };

  const handleSubscribe = async (priceId: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          userId,
          priceId
        }
      });

      if (error) throw error;

      if (!data?.sessionId) {
        throw new Error('ID da sessão não recebido');
      }

      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe não inicializado');

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId
      });

      if (stripeError) throw stripeError;

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

  if (products.length === 0) {
    return (
      <Card className="w-full max-w-sm mx-auto">
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {products.map((product) => (
        <Card key={product.id} className="w-full max-w-sm mx-auto mb-6">
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
            <CardDescription>{product.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: product.default_price.currency,
                }).format(product.default_price.unit_amount / 100)}
                /mês
              </p>
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
              onClick={() => handleSubscribe(product.default_price.id)}
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
      ))}
    </>
  );
}
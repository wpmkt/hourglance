import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlanHeader } from "./PlanHeader";
import { PlanFeatures } from "./PlanFeatures";

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

const stripePromise = loadStripe("pk_live_51QPiAhE1aaa3UksG7bR4l7obWeggUWCzyTMy4xyId9r35C36t3sQVU8zUhD10lCl5gYidxUhpwrJQru8aWke1u5o00osMexOWL");

const CheckoutForm = ({ onClose }: { onClose: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro no pagamento",
          description: error.message
        });
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      toast({
        variant: "destructive",
        title: "Erro no pagamento",
        description: "Ocorreu um erro ao processar seu pagamento. Tente novamente."
      });
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isLoading} 
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          'Pagar agora'
        )}
      </Button>
    </form>
  );
};

export function PlanCard({ userId }: PlanCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
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
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: { userId, priceId }
      });

      if (error) throw error;
      if (!data?.clientSecret) {
        throw new Error('Client Secret não recebido');
      }

      setClientSecret(data.clientSecret);
      setIsPaymentModalOpen(true);
    } catch (error) {
      console.error('Erro ao iniciar pagamento:', error);
      toast({
        variant: "destructive",
        title: "Erro ao iniciar pagamento",
        description: "Não foi possível iniciar o processo de pagamento. Tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setClientSecret(null);
  };

  const planFeatures = [
    "Recursos ilimitados",
    "Suporte prioritário 24/7",
    "Relatórios avançados",
    "Backup automático",
    "Acesso antecipado a novidades",
    "Integrações premium"
  ];

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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <Card key={product.id} className="w-full flex flex-col hover:shadow-lg transition-shadow duration-300">
            <PlanHeader
              name={product.name}
              description={product.description}
              price={product.default_price.unit_amount}
              currency={product.default_price.currency}
            />
            <CardContent>
              <PlanFeatures features={planFeatures} />
            </CardContent>
            <CardFooter className="mt-auto">
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
      </div>

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Pagamento</DialogTitle>
          </DialogHeader>
          {clientSecret && (
            <Elements 
              stripe={stripePromise} 
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                },
              }}
            >
              <CheckoutForm onClose={closePaymentModal} />
            </Elements>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
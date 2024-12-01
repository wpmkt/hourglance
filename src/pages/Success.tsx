import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Success() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-center">Assinatura Confirmada!</CardTitle>
          <CardDescription className="text-center">
            Obrigado por assinar nosso plano premium
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p>
            Sua assinatura foi processada com sucesso. Você agora tem acesso a todos os recursos premium.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link to="/">Voltar ao início</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
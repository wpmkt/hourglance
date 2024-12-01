import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSession } from "@/hooks/useSession";

const Login = () => {
  const navigate = useNavigate();
  const { session } = useSession();

  useEffect(() => {
    if (session) {
      navigate("/month/1");
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-neutral-900">
            Controle de Horas
          </h1>
          <p className="text-neutral-500">
            Faça login para continuar
          </p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#0f172a',
                  brandAccent: '#334155',
                }
              }
            }
          }}
          localization={{
            variables: {
              sign_in: {
                email_label: "Email",
                password_label: "Senha",
                email_input_placeholder: "seu@email.com",
                password_input_placeholder: "Sua senha",
                button_label: "Entrar",
                loading_button_label: "Entrando...",
                social_provider_text: "Entrar com {{provider}}",
                link_text: "Já tem uma conta? Entre"
              },
              sign_up: {
                email_label: "Email",
                password_label: "Senha",
                email_input_placeholder: "seu@email.com",
                password_input_placeholder: "Sua senha",
                button_label: "Cadastrar",
                loading_button_label: "Cadastrando...",
                social_provider_text: "Cadastrar com {{provider}}",
                link_text: "Não tem uma conta? Cadastre-se"
              }
            }
          }}
          theme="default"
          providers={[]}
        />
      </Card>
    </div>
  );
};

export default Login;
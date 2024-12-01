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
    <div className="min-h-screen bg-[#F1F0FB] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-indigo-900 mb-2">Bem-vindo</h1>
            <p className="text-indigo-600">Faça login para continuar</p>
          </div>
          
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: {
                default: {
                  colors: {
                    brand: '#818CF8',
                    brandAccent: '#6366F1',
                    inputBackground: '#F1F0FB',
                  },
                },
              },
            }}
            providers={[]}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Senha',
                  button_label: 'Entrar',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;

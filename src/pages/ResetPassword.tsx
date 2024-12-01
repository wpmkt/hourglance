import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSession } from "@/hooks/useSession";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { session } = useSession();

  useEffect(() => {
    if (session) {
      navigate("/month/1");
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-indigo-900 mb-2">Recuperar Senha</h1>
            <p className="text-indigo-600">Digite seu email para receber as instruções</p>
          </div>
          
          <Auth
            supabaseClient={supabase}
            view="forgotten_password"
            appearance={{
              theme: ThemeSupa,
              style: {
                button: {
                  background: 'rgb(79, 70, 229)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                  padding: '10px',
                },
                input: {
                  borderRadius: '8px',
                  fontSize: '16px',
                  padding: '10px',
                },
                anchor: {
                  color: 'rgb(79, 70, 229)',
                  fontSize: '14px',
                },
                message: {
                  fontSize: '14px',
                  padding: '10px',
                  borderRadius: '8px',
                  margin: '10px 0',
                },
              },
              variables: {
                default: {
                  colors: {
                    brand: 'rgb(79, 70, 229)',
                    brandAccent: 'rgb(67, 56, 202)',
                    inputBackground: 'white',
                    inputText: 'rgb(17, 24, 39)',
                    inputBorder: 'rgb(209, 213, 219)',
                    inputBorderHover: 'rgb(79, 70, 229)',
                    inputBorderFocus: 'rgb(79, 70, 229)',
                  },
                },
              },
            }}
            localization={{
              variables: {
                forgotten_password: {
                  email_label: 'Email',
                  password_label: 'Senha',
                  email_input_placeholder: 'Seu email',
                  button_label: 'Enviar instruções',
                  loading_button_label: 'Enviando instruções...',
                  link_text: 'Voltar para o login',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
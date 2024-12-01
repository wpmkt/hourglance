import Layout from "@/components/Layout";
import { PlanCard } from "@/components/subscription/PlanCard";
import { FAQ } from "@/components/subscription/FAQ";
import { useSession } from "@/hooks/useSession";
import { Sparkles } from "lucide-react";

const Subscription = () => {
  const { session } = useSession();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Desbloqueie todo o potencial</span>
          </div>
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Escolha o plano ideal para você
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Gerencie seu tempo de forma eficiente e tenha acesso a recursos exclusivos
            para otimizar sua rotina de trabalho.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "Recursos Ilimitados",
              description: "Acesso completo a todas as funcionalidades sem restrições"
            },
            {
              title: "Suporte Prioritário",
              description: "Atendimento exclusivo com tempo de resposta reduzido"
            },
            {
              title: "Relatórios Avançados",
              description: "Análises detalhadas e insights sobre sua rotina"
            }
          ].map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-neutral-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Plan Cards */}
        <div className="mb-16">
          <PlanCard userId={session?.user?.id || ''} />
        </div>

        {/* FAQ Section */}
        <FAQ />

        {/* Trust Indicators */}
        <div className="text-center mt-16 pb-8">
          <p className="text-sm text-neutral-500">
            Pagamento seguro via Stripe 🔒 | Garantia de 30 dias ⭐️ | Suporte 24/7 💬
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Subscription;
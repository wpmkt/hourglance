import Layout from "@/components/Layout";
import { PlanCard } from "@/components/subscription/PlanCard";
import { useSession } from "@/hooks/useSession";

const Subscription = () => {
  const { session } = useSession();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Escolha seu plano
          </h1>
          <p className="text-lg text-gray-600">
            Continue aproveitando todos os recursos com nossa assinatura premium
          </p>
        </div>
        
        <div className="mt-8">
          <PlanCard userId={session?.user?.id || ''} />
        </div>
      </div>
    </Layout>
  );
};

export default Subscription;
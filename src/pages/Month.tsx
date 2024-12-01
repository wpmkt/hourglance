import { useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import Layout from "@/components/Layout";
import MonthContent from "@/components/MonthContent";
import { useSession } from "@/hooks/useSession";

const Month = () => {
  const { id } = useParams();
  const { session, isLoading } = useSession();
  
  const currentDate = (() => {
    if (!id) return new Date();
    try {
      return parseISO(id);
    } catch {
      return new Date();
    }
  })();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Carregando...</div>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <Layout>
      <MonthContent 
        currentDate={currentDate}
        userId={session.user.id}
      />
    </Layout>
  );
};

export default Month;
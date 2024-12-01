import { useParams } from "react-router-dom";
import { parseISO } from "date-fns";
import Layout from "@/components/Layout";
import MonthContent from "@/components/MonthContent";
import { useSession } from "@/hooks/useSession";

const Month = () => {
  const { date } = useParams();
  const { session, isLoading } = useSession();
  
  const currentDate = (() => {
    if (!date) return new Date();
    try {
      return parseISO(date);
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
import { useParams, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import Layout from "@/components/Layout";
import MonthContent from "@/components/MonthContent";
import { useSession } from "@/hooks/useSession";

const Month = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session, isLoading } = useSession();
  
  const currentDate = (() => {
    if (!id) return new Date();
    try {
      const parsedDate = parseISO(id);
      return !isNaN(parsedDate.getTime()) ? parsedDate : new Date();
    } catch {
      return new Date();
    }
  })();

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    navigate(`/month/${format(newDate, "yyyy-MM-dd")}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg">Carregando...</div>
        </div>
      </Layout>
    );
  }

  if (!session) {
    navigate("/login");
    return null;
  }

  return (
    <Layout>
      <MonthContent 
        currentDate={currentDate}
        userId={session.user.id}
        onNavigate={navigateMonth}
      />
    </Layout>
  );
};

export default Month;
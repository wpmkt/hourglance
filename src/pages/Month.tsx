import { useParams, useNavigate } from "react-router-dom";
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShiftDialog } from "@/components/ShiftDialog";
import { NonAccountingDayDialog } from "@/components/NonAccountingDayDialog";
import Layout from "@/components/Layout";
import MonthNavigation from "@/components/MonthNavigation";
import MonthlySummary from "@/components/MonthlySummary";
import ShiftsList from "@/components/ShiftsList";
import NonAccountingDaysList from "@/components/NonAccountingDaysList";
import { useToast } from "@/components/ui/use-toast";

const Month = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const currentDate = (() => {
    if (!id) return new Date();
    try {
      const parsedDate = parseISO(id);
      return !isNaN(parsedDate.getTime()) ? parsedDate : new Date();
    } catch {
      return new Date();
    }
  })();

  const fetchMonthData = async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Erro de sessão:", sessionError);
      throw new Error("Erro ao verificar autenticação");
    }

    if (!sessionData.session) {
      throw new Error("Usuário não autenticado");
    }

    const userId = sessionData.session.user.id;
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);

    const startDate = format(start, "yyyy-MM-dd");
    const endDate = format(end, "yyyy-MM-dd");

    // Buscar turnos
    const { data: shifts, error: shiftsError } = await supabase
      .from("shifts")
      .select("*")
      .eq("user_id", userId)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true });

    if (shiftsError) {
      console.error("Erro ao buscar turnos:", shiftsError);
      throw shiftsError;
    }

    // Buscar dias não contábeis
    const { data: nonAccountingDays, error: nonAccountingError } = await supabase
      .from("non_accounting_days")
      .select("*")
      .eq("user_id", userId)
      .or(`start_date.lte.${endDate},end_date.gte.${startDate}`)
      .order("start_date", { ascending: true });

    if (nonAccountingError) {
      console.error("Erro ao buscar dias não contábeis:", nonAccountingError);
      throw nonAccountingError;
    }

    return {
      shifts: shifts || [],
      nonAccountingDays: nonAccountingDays || []
    };
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["month-data", id],
    queryFn: fetchMonthData,
    retry: 1,
  });

  if (error) {
    console.error("Erro na query:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    
    if (errorMessage === "Usuário não autenticado") {
      navigate("/login");
      return null;
    }

    toast({
      title: "Erro ao carregar dados",
      description: "Ocorreu um erro ao carregar os dados do mês. Por favor, tente novamente.",
      variant: "destructive",
    });
  }

  const calculateWorkingDays = () => {
    if (!data) return 0;
    const daysInMonth = endOfMonth(currentDate).getDate();
    const nonAccountingDays = data.nonAccountingDays?.reduce((acc, day) => {
      const start = parseISO(day.start_date);
      const end = parseISO(day.end_date);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return acc + days;
    }, 0) || 0;
    return daysInMonth - nonAccountingDays;
  };

  const calculateWorkedHours = () => {
    if (!data?.shifts) return 0;
    return data.shifts.reduce((acc, shift) => {
      const start = new Date(`1970-01-01T${shift.start_time}`);
      const end = new Date(`1970-01-01T${shift.end_time}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return acc + hours;
    }, 0);
  };

  const calculateExpectedHours = () => {
    const workingDays = calculateWorkingDays();
    return (160 / 30) * workingDays;
  };

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

  return (
    <Layout>
      <div className="space-y-6">
        <MonthNavigation currentDate={currentDate} onNavigate={navigateMonth} />

        <MonthlySummary
          daysInMonth={endOfMonth(currentDate).getDate()}
          nonAccountingDays={data?.nonAccountingDays?.length || 0}
          workingDays={calculateWorkingDays()}
          expectedHours={calculateExpectedHours()}
          workedHours={calculateWorkedHours()}
        />

        <div className="flex gap-4">
          <ShiftDialog />
          <NonAccountingDayDialog />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NonAccountingDaysList nonAccountingDays={data?.nonAccountingDays || []} />
          <ShiftsList shifts={data?.shifts || []} />
        </div>
      </div>
    </Layout>
  );
};

export default Month;
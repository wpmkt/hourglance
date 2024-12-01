import { format, startOfMonth, endOfMonth } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShiftDialog } from "@/components/ShiftDialog";
import { NonAccountingDayDialog } from "@/components/NonAccountingDayDialog";
import MonthlySummary from "@/components/MonthlySummary";
import ShiftsList from "@/components/ShiftsList";
import NonAccountingDaysList from "@/components/NonAccountingDaysList";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";
import { ArrowLeft, LogOut } from "lucide-react";

type Shift = Database["public"]["Tables"]["shifts"]["Row"];
type NonAccountingDay = Database["public"]["Tables"]["non_accounting_days"]["Row"];

interface MonthContentProps {
  currentDate: Date;
  userId: string;
}

const MonthContent = ({ currentDate, userId }: MonthContentProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const calculateNightMinutes = (start: string, end: string) => {
    const startDate = new Date(`1970-01-01T${start}`);
    let endDate = new Date(`1970-01-01T${end}`);
    
    if (endDate < startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }

    const nightStartHour = 23;
    const nightEndHour = 5;

    let nightMinutes = 0;
    let currentHour = startDate.getHours();
    let currentDate = new Date(startDate);

    while (currentDate < endDate) {
      if (currentHour >= nightStartHour || currentHour < nightEndHour) {
        nightMinutes += 10;
      }
      currentDate.setTime(currentDate.getTime() + 3600000); // Add 1 hour in milliseconds
      currentHour = currentDate.getHours();
    }

    return nightMinutes;
  };

  const fetchMonthData = async () => {
    try {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      const startDate = format(start, "yyyy-MM-dd");
      const endDate = format(end, "yyyy-MM-dd");

      const [shiftsResponse, nonAccountingResponse] = await Promise.all([
        supabase
          .from("shifts")
          .select("*")
          .eq("user_id", userId)
          .gte("date", startDate)
          .lte("date", endDate)
          .order("date", { ascending: true }),
        supabase
          .from("non_accounting_days")
          .select("*")
          .eq("user_id", userId)
          .or(`start_date.lte.${endDate},end_date.gte.${startDate}`)
          .order("start_date", { ascending: true })
      ]);

      if (shiftsResponse.error) throw shiftsResponse.error;
      if (nonAccountingResponse.error) throw nonAccountingResponse.error;

      return {
        shifts: shiftsResponse.data as Shift[],
        nonAccountingDays: nonAccountingResponse.data as NonAccountingDay[]
      };
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      throw error;
    }
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["month-data", format(currentDate, "yyyy-MM"), userId],
    queryFn: fetchMonthData,
    enabled: !!userId,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  if (error) {
    console.error("Erro na query:", error);
    toast({
      title: "Erro ao carregar dados",
      description: "Ocorreu um erro ao carregar os dados do mês. Por favor, tente novamente.",
      variant: "destructive",
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-lg">Carregando dados...</div>
      </div>
    );
  }

  const safeData = {
    shifts: data?.shifts || [],
    nonAccountingDays: data?.nonAccountingDays || []
  };

  const calculateWorkingDays = () => {
    const daysInMonth = endOfMonth(currentDate).getDate();
    const nonAccountingDays = safeData.nonAccountingDays.length;
    return daysInMonth - nonAccountingDays;
  };

  const calculateWorkedHours = () => {
    return safeData.shifts.reduce((acc, shift) => {
      const start = new Date(`1970-01-01T${shift.start_time}`);
      let end = new Date(`1970-01-01T${shift.end_time}`);
      
      if (end < start) {
        end.setDate(end.getDate() + 1);
      }

      const baseHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      const nightMinutes = calculateNightMinutes(shift.start_time, shift.end_time);
      const additionalHours = nightMinutes / 60;

      return acc + baseHours + additionalHours;
    }, 0);
  };

  const calculateExpectedHours = () => {
    const workingDays = calculateWorkingDays();
    return (160 / 30) * workingDays;
  };

  const handleNavigate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    navigate(`/month/${format(newDate, "yyyy-MM-dd")}`);
  };

  return (
    <div className="min-h-screen bg-[#8B5CF6]">
      <div className="bg-[#8B5CF6] text-white">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
            <button 
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            >
              Sair
              <LogOut className="w-5 h-5" />
            </button>
          </div>
          <h1 className="text-2xl font-semibold mb-6">
            {format(currentDate, "d 'de' yyyy")}
          </h1>
          <div className="space-y-3 mb-6">
            <button 
              onClick={() => document.querySelector<HTMLButtonElement>('[data-dialog-trigger="shift"]')?.click()}
              className="w-full bg-white text-[#8B5CF6] py-3 rounded-lg font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
            >
              + Turno
            </button>
            <button
              onClick={() => document.querySelector<HTMLButtonElement>('[data-dialog-trigger="non-accounting"]')?.click()}
              className="w-full bg-white/20 text-white py-3 rounded-lg font-medium hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
            >
              + Dia Não Contábil
            </button>
          </div>
          <div className="bg-white/20 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-medium mb-4">Dias do Mês</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Dias Previstos</span>
                <span className="font-medium">{endOfMonth(currentDate).getDate()}</span>
              </div>
              <div className="flex justify-between">
                <span>Dias Não Contábeis</span>
                <span className="font-medium">{safeData.nonAccountingDays.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Dias a Trabalhar</span>
                <span className="font-medium text-[#D6BCFA]">{calculateWorkingDays()}</span>
              </div>
            </div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <h2 className="text-lg font-medium mb-4">Horas do Mês</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Horas Previstas</span>
                <span className="font-medium">{calculateExpectedHours().toFixed(1)}h</span>
              </div>
              <div className="flex justify-between">
                <span>Horas Trabalhadas</span>
                <span className="font-medium">{calculateWorkedHours().toFixed(1)}h</span>
              </div>
              <div className="flex justify-between">
                <span>Saldo</span>
                <span className="font-medium text-[#D6BCFA]">
                  {(calculateWorkedHours() - calculateExpectedHours()).toFixed(1)}h
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden">
        <ShiftDialog currentDate={currentDate} />
        <NonAccountingDayDialog currentDate={currentDate} />
      </div>
    </div>
  );
};

export default MonthContent;
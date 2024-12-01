import { format, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShiftDialog } from "@/components/ShiftDialog";
import { NonAccountingDayDialog } from "@/components/NonAccountingDayDialog";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";
import MonthHeader from "./month/MonthHeader";
import MonthActions from "./month/MonthActions";
import MonthStats from "./month/MonthStats";
import ShiftsList from "./ShiftsList";
import NonAccountingDaysList from "./NonAccountingDaysList";

type Shift = Database["public"]["Tables"]["shifts"]["Row"];
type NonAccountingDay = Database["public"]["Tables"]["non_accounting_days"]["Row"];

interface MonthContentProps {
  currentDate: Date;
  userId: string;
}

const MonthContent = ({ currentDate, userId }: MonthContentProps) => {
  const { toast } = useToast();

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

      console.log('Fetching data for:', { startDate, endDate, userId });

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

      console.log('Shifts Response:', shiftsResponse);
      console.log('Non Accounting Response:', nonAccountingResponse);

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

  const handleEditShift = (shift: Shift) => {
    document.querySelector<HTMLButtonElement>('[data-dialog-trigger="shift"]')?.click();
    // You'll need to implement the logic to populate the form with the shift data
  };

  const handleEditNonAccountingDay = (day: NonAccountingDay) => {
    document.querySelector<HTMLButtonElement>('[data-dialog-trigger="non-accounting"]')?.click();
    // You'll need to implement the logic to populate the form with the non-accounting day data
  };

  return (
    <div className="min-h-screen bg-[#9b87f5]">
      <div className="bg-[#9b87f5] text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <MonthHeader currentDate={currentDate} />
          
          <MonthActions 
            onOpenShiftDialog={() => document.querySelector<HTMLButtonElement>('[data-dialog-trigger="shift"]')?.click()}
            onOpenNonAccountingDialog={() => document.querySelector<HTMLButtonElement>('[data-dialog-trigger="non-accounting"]')?.click()}
          />

          <MonthStats 
            daysInMonth={endOfMonth(currentDate).getDate()}
            nonAccountingDays={safeData.nonAccountingDays.length}
            workingDays={calculateWorkingDays()}
            expectedHours={calculateExpectedHours()}
            workedHours={calculateWorkedHours()}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <ShiftsList 
              shifts={safeData.shifts}
              onEdit={handleEditShift}
            />
            <NonAccountingDaysList 
              nonAccountingDays={safeData.nonAccountingDays}
              onEdit={handleEditNonAccountingDay}
            />
          </div>
        </div>
      </div>
      <div className="hidden">
        <ShiftDialog currentDate={currentDate} />
        <NonAccountingDayDialog currentDate={currentDate} />
      </div>
    </div>
  );
}

export default MonthContent;
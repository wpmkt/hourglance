import { format, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShiftDialog } from "@/components/ShiftDialog";
import { NonAccountingDayDialog } from "@/components/NonAccountingDayDialog";
import MonthNavigation from "@/components/MonthNavigation";
import MonthlySummary from "@/components/MonthlySummary";
import ShiftsList from "@/components/ShiftsList";
import NonAccountingDaysList from "@/components/NonAccountingDaysList";
import { useToast } from "@/components/ui/use-toast";

interface MonthContentProps {
  currentDate: Date;
  userId: string;
  onNavigate: (direction: "prev" | "next") => void;
}

const MonthContent = ({ currentDate, userId, onNavigate }: MonthContentProps) => {
  const { toast } = useToast();

  const fetchMonthData = async () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);

    const startDate = format(start, "yyyy-MM-dd");
    const endDate = format(end, "yyyy-MM-dd");

    const { data: shifts, error: shiftsError } = await supabase
      .from("shifts")
      .select("*")
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true });

    if (shiftsError) throw shiftsError;

    const { data: nonAccountingDays, error: nonAccountingError } = await supabase
      .from("non_accounting_days")
      .select("*")
      .or(`start_date.lte.${endDate},end_date.gte.${startDate}`)
      .order("start_date", { ascending: true });

    if (nonAccountingError) throw nonAccountingError;

    return {
      shifts: shifts || [],
      nonAccountingDays: nonAccountingDays || []
    };
  };

  const { data, error } = useQuery({
    queryKey: ["month-data", format(currentDate, "yyyy-MM"), userId],
    queryFn: fetchMonthData,
    retry: 1,
  });

  if (error) {
    console.error("Erro na query:", error);
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

  const safeData = {
    shifts: data?.shifts || [],
    nonAccountingDays: data?.nonAccountingDays || []
  };

  return (
    <div className="space-y-6">
      <MonthNavigation currentDate={currentDate} onNavigate={onNavigate} />

      <MonthlySummary
        daysInMonth={endOfMonth(currentDate).getDate()}
        nonAccountingDays={safeData.nonAccountingDays.length}
        workingDays={calculateWorkingDays()}
        expectedHours={calculateExpectedHours()}
        workedHours={calculateWorkedHours()}
      />

      <div className="flex gap-4">
        <ShiftDialog />
        <NonAccountingDayDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NonAccountingDaysList nonAccountingDays={safeData.nonAccountingDays} />
        <ShiftsList shifts={safeData.shifts} />
      </div>
    </div>
  );
};

export default MonthContent;
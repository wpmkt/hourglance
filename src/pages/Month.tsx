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

const Month = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentDate = id ? parseISO(id) : new Date();

  const fetchMonthData = async () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);

    const { data: shifts, error: shiftsError } = await supabase
      .from("shifts")
      .select("*")
      .gte("date", start.toISOString())
      .lte("date", end.toISOString())
      .order("date", { ascending: true });

    if (shiftsError) throw shiftsError;

    const { data: nonAccountingDays, error: nonAccountingError } = await supabase
      .from("non_accounting_days")
      .select("*")
      .or(`start_date.lte.${end.toISOString()},end_date.gte.${start.toISOString()}`)
      .order("start_date", { ascending: true });

    if (nonAccountingError) throw nonAccountingError;

    return { shifts, nonAccountingDays };
  };

  const { data, isLoading } = useQuery({
    queryKey: ["month-data", id],
    queryFn: fetchMonthData,
  });

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
    return <div>Carregando...</div>;
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
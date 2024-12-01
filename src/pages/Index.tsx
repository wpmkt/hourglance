import Layout from "@/components/Layout";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfQuarter, endOfQuarter, getDaysInMonth, isWeekend } from "date-fns";
import { useSession } from "@/hooks/useSession";
import { QuarterSelector } from "@/components/dashboard/QuarterSelector";
import { QuarterCard } from "@/components/dashboard/QuarterCard";
import { MonthsList } from "@/components/dashboard/MonthsList";
import MonthlySummary from "@/components/MonthlySummary";

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const quarters = [
  { id: "1", title: "1º Trimestre" },
  { id: "2", title: "2º Trimestre" },
  { id: "3", title: "3º Trimestre" },
  { id: "4", title: "4º Trimestre" }
];

const Index = () => {
  const { session } = useSession();
  const userId = session?.user?.id;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentQuarter = Math.floor(new Date().getMonth() / 3) + 1;
  const [selectedQuarter, setSelectedQuarter] = useState(currentQuarter.toString());

  // Current month data query
  const { data: currentMonthData } = useQuery({
    queryKey: ["current-month-data", userId, currentMonth],
    queryFn: async () => {
      if (!userId) return null;

      const startDate = new Date(currentYear, currentMonth, 1);
      const endDate = new Date(currentYear, currentMonth + 1, 0);
      const formattedStartDate = format(startDate, "yyyy-MM-dd");
      const formattedEndDate = format(endDate, "yyyy-MM-dd");

      const [shiftsResponse, nonAccountingResponse] = await Promise.all([
        supabase
          .from("shifts")
          .select("*")
          .eq("user_id", userId)
          .gte("date", formattedStartDate)
          .lte("date", formattedEndDate),
        supabase
          .from("non_accounting_days")
          .select("*")
          .eq("user_id", userId)
          .or(`start_date.lte.${formattedEndDate},end_date.gte.${formattedStartDate}`)
      ]);

      if (shiftsResponse.error) throw shiftsResponse.error;
      if (nonAccountingResponse.error) throw nonAccountingResponse.error;

      return {
        shifts: shiftsResponse.data,
        nonAccountingDays: nonAccountingResponse.data
      };
    },
    enabled: !!userId
  });

  // Quarter data query
  const { data: quarterData } = useQuery({
    queryKey: ["quarter-data", selectedQuarter, userId],
    queryFn: async () => {
      if (!userId) return null;

      const quarterStartMonth = (parseInt(selectedQuarter) - 1) * 3;
      const startDate = startOfQuarter(new Date(currentYear, quarterStartMonth));
      const endDate = endOfQuarter(new Date(currentYear, quarterStartMonth));
      const formattedStartDate = format(startDate, "yyyy-MM-dd");
      const formattedEndDate = format(endDate, "yyyy-MM-dd");

      const [shiftsResponse, nonAccountingResponse] = await Promise.all([
        supabase
          .from("shifts")
          .select("*")
          .eq("user_id", userId)
          .gte("date", formattedStartDate)
          .lte("date", formattedEndDate),
        supabase
          .from("non_accounting_days")
          .select("*")
          .eq("user_id", userId)
          .or(`start_date.lte.${formattedEndDate},end_date.gte.${formattedStartDate}`)
      ]);

      if (shiftsResponse.error) throw shiftsResponse.error;
      if (nonAccountingResponse.error) throw nonAccountingResponse.error;

      return {
        shifts: shiftsResponse.data,
        nonAccountingDays: nonAccountingResponse.data
      };
    },
    enabled: !!userId
  });

  // Calculate current month stats
  const calculateMonthStats = () => {
    if (!currentMonthData) return {
      daysInMonth: 0,
      nonAccountingDays: 0,
      workingDays: 0,
      expectedHours: 0,
      workedHours: 0
    };

    const daysInMonth = getDaysInMonth(new Date(currentYear, currentMonth));
    let nonAccountingDays = 0;
    let workingDays = 0;

    // Count working days and non-accounting days
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(currentYear, currentMonth, day);
      const isNonAccounting = currentMonthData.nonAccountingDays.some(nad => {
        const startDate = new Date(nad.start_date);
        const endDate = new Date(nad.end_date);
        return currentDate >= startDate && currentDate <= endDate;
      });

      if (isNonAccounting || isWeekend(currentDate)) {
        nonAccountingDays++;
      } else {
        workingDays++;
      }
    }

    const expectedHours = workingDays * 8;

    const workedHours = currentMonthData.shifts.reduce((acc, shift) => {
      const start = new Date(`1970-01-01T${shift.start_time}`);
      let end = new Date(`1970-01-01T${shift.end_time}`);
      
      if (end < start) {
        end.setDate(end.getDate() + 1);
      }

      const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return acc + diffHours;
    }, 0);

    return {
      daysInMonth,
      nonAccountingDays,
      workingDays,
      expectedHours,
      workedHours
    };
  };

  // Calculate quarter stats
  const calculateQuarterStats = () => {
    if (!quarterData) return { expectedHours: 0, workedHours: 0, balance: 0 };

    const quarterStartMonth = (parseInt(selectedQuarter) - 1) * 3;
    const startDate = startOfQuarter(new Date(currentYear, quarterStartMonth));
    const endDate = endOfQuarter(new Date(currentYear, quarterStartMonth));
    
    let workingDays = 0;
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const isNonAccounting = quarterData.nonAccountingDays.some(nad => {
        const nadStart = new Date(nad.start_date);
        const nadEnd = new Date(nad.end_date);
        return currentDate >= nadStart && currentDate <= nadEnd;
      });

      if (!isNonAccounting && !isWeekend(currentDate)) {
        workingDays++;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    const expectedHours = workingDays * 8;

    const workedHours = quarterData.shifts.reduce((acc, shift) => {
      const start = new Date(`1970-01-01T${shift.start_time}`);
      let end = new Date(`1970-01-01T${shift.end_time}`);
      
      if (end < start) {
        end.setDate(end.getDate() + 1);
      }

      const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return acc + diffHours;
    }, 0);

    return {
      expectedHours,
      workedHours,
      balance: workedHours - expectedHours
    };
  };

  const monthStats = calculateMonthStats();
  const quarterStats = calculateQuarterStats();

  return (
    <Layout>
      <div className="space-y-8">
        <MonthlySummary {...monthStats} />

        <div className="space-y-6">
          <QuarterSelector
            quarters={quarters}
            selectedQuarter={selectedQuarter}
            onQuarterChange={setSelectedQuarter}
          />

          <QuarterCard
            quarter={quarters.find(q => q.id === selectedQuarter)!}
            stats={quarterStats}
            currentYear={currentYear}
          />
        </div>

        <MonthsList months={months} />
      </div>
    </Layout>
  );
};

export default Index;
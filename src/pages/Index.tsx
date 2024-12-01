import Layout from "@/components/Layout";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfQuarter, endOfQuarter } from "date-fns";
import { useSession } from "@/hooks/useSession";
import { QuarterSelector } from "@/components/dashboard/QuarterSelector";
import { QuarterCard } from "@/components/dashboard/QuarterCard";
import { MonthsList } from "@/components/dashboard/MonthsList";

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
  const currentQuarter = Math.floor(new Date().getMonth() / 3) + 1;
  const [selectedQuarter, setSelectedQuarter] = useState(currentQuarter.toString());

  const getQuarterDates = (quarter: number) => {
    const startMonth = (quarter - 1) * 3;
    const startDate = startOfQuarter(new Date(currentYear, startMonth));
    const endDate = endOfQuarter(new Date(currentYear, startMonth));
    return { startDate, endDate };
  };

  const { data: quarterData } = useQuery({
    queryKey: ["quarter-data", selectedQuarter, userId],
    queryFn: async () => {
      if (!userId) return null;

      const { startDate, endDate } = getQuarterDates(Number(selectedQuarter));
      const formattedStartDate = format(startDate, "yyyy-MM-dd");
      const formattedEndDate = format(endDate, "yyyy-MM-dd");

      const [shiftsResponse, nonAccountingResponse] = await Promise.all([
        supabase
          .from("shifts")
          .select("*")
          .eq("user_id", userId)
          .gte("date", formattedStartDate)
          .lte("date", formattedEndDate)
          .order("date", { ascending: true }),
        supabase
          .from("non_accounting_days")
          .select("*")
          .eq("user_id", userId)
          .or(`start_date.lte.${formattedEndDate},end_date.gte.${formattedStartDate}`)
          .order("start_date", { ascending: true })
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

  const calculateQuarterStats = () => {
    if (!quarterData) return { expectedHours: 0, workedHours: 0, balance: 0 };

    const { startDate, endDate } = getQuarterDates(Number(selectedQuarter));
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const nonAccountingDays = quarterData.nonAccountingDays.reduce((acc, day) => {
      const dayStart = new Date(day.start_date);
      const dayEnd = new Date(day.end_date);
      let count = 0;
      let current = new Date(Math.max(startDate.getTime(), dayStart.getTime()));
      const end = new Date(Math.min(endDate.getTime(), dayEnd.getTime()));
      
      while (current <= end) {
        count++;
        current.setDate(current.getDate() + 1);
      }
      return acc + count;
    }, 0);

    const workingDays = totalDays - nonAccountingDays;
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

  const stats = calculateQuarterStats();

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-end items-center mb-8">
          <select className="bg-white border border-neutral-200 rounded-xl px-4 py-2 text-sm font-medium text-neutral-700 hover:border-neutral-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20">
            {[currentYear - 1, currentYear, currentYear + 1].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <QuarterSelector
            quarters={quarters}
            selectedQuarter={selectedQuarter}
            onQuarterChange={setSelectedQuarter}
          />

          <div className="col-span-1 md:col-span-2">
            <QuarterCard
              quarter={quarters.find(q => q.id === selectedQuarter)!}
              stats={stats}
              currentYear={currentYear}
            />
          </div>
        </div>

        <MonthsList months={months} />
      </div>
    </Layout>
  );
};

export default Index;
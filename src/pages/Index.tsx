import Layout from "@/components/Layout";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { startOfYear, endOfYear, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import QuarterStats from "@/components/dashboard/QuarterStats";
import MonthCard from "@/components/dashboard/MonthCard";
import type { Database } from "@/integrations/supabase/types";

type Shift = Database["public"]["Tables"]["shifts"]["Row"];
type NonAccountingDay = Database["public"]["Tables"]["non_accounting_days"]["Row"];

const Index = () => {
  const currentYear = new Date().getFullYear();
  const currentQuarter = Math.floor((new Date().getMonth() / 3)) + 1;
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedQuarter, setSelectedQuarter] = useState(currentQuarter.toString());

  const { data, isLoading } = useQuery({
    queryKey: ['year-data', selectedYear],
    queryFn: async () => {
      const startDate = format(startOfYear(new Date(selectedYear, 0)), 'yyyy-MM-dd');
      const endDate = format(endOfYear(new Date(selectedYear, 11)), 'yyyy-MM-dd');

      const [shiftsResponse, nonAccountingResponse] = await Promise.all([
        supabase
          .from("shifts")
          .select("*")
          .gte("date", startDate)
          .lte("date", endDate)
          .order("date", { ascending: true }),
        supabase
          .from("non_accounting_days")
          .select("*")
          .or(`start_date.lte.${endDate},end_date.gte.${startDate}`)
          .order("start_date", { ascending: true })
      ]);

      if (shiftsResponse.error) throw shiftsResponse.error;
      if (nonAccountingResponse.error) throw nonAccountingResponse.error;

      return {
        shifts: shiftsResponse.data as Shift[],
        nonAccountingDays: nonAccountingResponse.data as NonAccountingDay[]
      };
    }
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-lg">Carregando dados...</div>
        </div>
      </Layout>
    );
  }

  const quarters = [1, 2, 3, 4];
  const months = Array.from({ length: 12 }, (_, i) => i);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-end items-center mb-8">
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-white border border-neutral-200 rounded-xl px-4 py-2 text-sm font-medium text-neutral-700 hover:border-neutral-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {[currentYear - 1, currentYear, currentYear + 1].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Tabs 
            defaultValue={selectedQuarter} 
            value={selectedQuarter} 
            onValueChange={setSelectedQuarter} 
            className="w-full col-span-1 md:col-span-2"
          >
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full mb-8 bg-neutral-100 p-1 rounded-xl">
              {quarters.map((quarter) => (
                <TabsTrigger 
                  key={quarter} 
                  value={quarter.toString()} 
                  className="text-sm py-3 data-[state=active]:bg-neutral-800 data-[state=active]:text-white"
                >
                  {quarter}º Trimestre
                </TabsTrigger>
              ))}
            </TabsList>

            {quarters.map((quarter) => (
              <TabsContent key={quarter} value={quarter.toString()} className="mt-0">
                <QuarterStats
                  quarter={quarter}
                  year={selectedYear}
                  shifts={data?.shifts || []}
                  nonAccountingDays={data?.nonAccountingDays || []}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="mt-12">
          <h2 className="text-lg font-semibold text-neutral-900 mb-6">Meses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {months.map((month) => (
              <MonthCard
                key={month}
                month={month}
                year={selectedYear}
                shifts={data?.shifts || []}
                nonAccountingDays={data?.nonAccountingDays || []}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
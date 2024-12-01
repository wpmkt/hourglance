import Layout from "@/components/Layout";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfQuarter, endOfQuarter, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSession } from "@/hooks/useSession";

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
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
    
    // Calculate non-accounting days
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
    const expectedHours = (workingDays * 8);

    // Calculate worked hours
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

  const quarters = [
    {
      id: "1",
      title: "1º Trimestre",
      months: months.slice(0, 3)
    },
    {
      id: "2",
      title: "2º Trimestre",
      months: months.slice(3, 6)
    },
    {
      id: "3",
      title: "3º Trimestre",
      months: months.slice(6, 9)
    },
    {
      id: "4",
      title: "4º Trimestre",
      months: months.slice(9, 12)
    }
  ];

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
          <TabsList className="grid grid-cols-2 md:grid-cols-2 w-full gap-4">
            {quarters.map((quarter, index) => (
              <TabsTrigger
                key={quarter.id}
                value={quarter.id}
                className={`text-sm p-4 rounded-xl transition-all ${
                  selectedQuarter === quarter.id
                    ? "bg-primary text-white shadow-lg scale-105"
                    : `bg-neutral-${100 + index * 100} hover:bg-neutral-${200 + index * 100}`
                }`}
              >
                {quarter.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="col-span-1 md:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-neutral-100">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {quarters.find(q => q.id === selectedQuarter)?.title}
                  </h3>
                  <span className="bg-neutral-50 px-3 py-1 rounded-lg text-sm text-neutral-600">
                    {currentYear}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-neutral-50 p-4 rounded-xl">
                    <p className="text-sm text-neutral-500 mb-1">Horas previstas</p>
                    <p className="text-xl font-bold text-neutral-900">{stats.expectedHours.toFixed(1)}h</p>
                  </div>
                  
                  <div className="bg-neutral-50 p-4 rounded-xl">
                    <p className="text-sm text-neutral-500 mb-1">Horas trabalhadas</p>
                    <p className="text-xl font-bold text-neutral-900">{stats.workedHours.toFixed(1)}h</p>
                  </div>

                  <div className="bg-neutral-50 p-4 rounded-xl">
                    <p className="text-sm text-neutral-500 mb-1">Saldo</p>
                    <p className={`text-xl font-bold ${stats.balance >= 0 ? 'text-success' : 'text-danger'}`}>
                      {stats.balance >= 0 ? '+' : ''}{stats.balance.toFixed(1)}h
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-lg font-semibold text-neutral-900 mb-6">Meses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {months.map((month, index) => (
              <Link
                key={month}
                to={`/month/${index + 1}`}
                className="group block"
              >
                <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-neutral-100 group-hover:border-primary">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-medium text-neutral-900">{month}</h3>
                    <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
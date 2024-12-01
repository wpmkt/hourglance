import Layout from "@/components/Layout";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth, getMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { calculateTotalHours } from "@/utils/timeCalculations";

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
  const currentYear = new Date().getFullYear();
  const currentQuarter = Math.floor((new Date().getMonth() / 3)) + 1;
  const [selectedQuarter, setSelectedQuarter] = useState(currentQuarter.toString());

  const fetchQuarterData = async (quarter: number) => {
    const startMonth = (quarter - 1) * 3;
    const endMonth = startMonth + 2;
    
    const startDate = new Date(currentYear, startMonth, 1);
    const endDate = endOfMonth(new Date(currentYear, endMonth, 1));
    
    const formattedStartDate = format(startDate, 'yyyy-MM-dd');
    const formattedEndDate = format(endDate, 'yyyy-MM-dd');

    const [shiftsResponse, nonAccountingResponse] = await Promise.all([
      supabase
        .from("shifts")
        .select("*")
        .gte("date", formattedStartDate)
        .lte("date", formattedEndDate),
      supabase
        .from("non_accounting_days")
        .select("*")
        .or(`start_date.lte.${formattedEndDate},end_date.gte.${formattedStartDate}`)
    ]);

    return {
      shifts: shiftsResponse.data || [],
      nonAccountingDays: nonAccountingResponse.data || []
    };
  };

  const calculateQuarterStats = (quarter: number) => {
    const { data } = useQuery({
      queryKey: ['quarter-data', quarter],
      queryFn: () => fetchQuarterData(quarter),
    });

    if (!data) return { planned: 0, worked: 0, balance: 0 };

    const startMonth = (quarter - 1) * 3;
    let totalWorkedHours = 0;
    let totalPlannedHours = 0;

    for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
      const currentMonth = startMonth + monthOffset;
      const date = new Date(currentYear, currentMonth, 1);
      const daysInMonth = endOfMonth(date).getDate();
      const monthShifts = data.shifts.filter(shift => 
        getMonth(new Date(shift.date)) === currentMonth
      );
      
      const monthNonAccountingDays = data.nonAccountingDays.filter(day => {
        const startDate = new Date(day.start_date);
        const endDate = new Date(day.end_date);
        return getMonth(startDate) === currentMonth || getMonth(endDate) === currentMonth;
      }).length;

      const workingDays = daysInMonth - monthNonAccountingDays;
      totalPlannedHours += (160 / 30) * workingDays;

      monthShifts.forEach(shift => {
        totalWorkedHours += calculateTotalHours(shift.start_time, shift.end_time);
      });
    }

    return {
      planned: Math.round(totalPlannedHours),
      worked: Math.round(totalWorkedHours),
      balance: Math.round(totalWorkedHours - totalPlannedHours)
    };
  };

  const quarters = [
    {
      id: "1",
      title: "1º Trimestre",
      months: months.slice(0, 3),
      stats: calculateQuarterStats(1)
    },
    {
      id: "2",
      title: "2º Trimestre",
      months: months.slice(3, 6),
      stats: calculateQuarterStats(2)
    },
    {
      id: "3",
      title: "3º Trimestre",
      months: months.slice(6, 9),
      stats: calculateQuarterStats(3)
    },
    {
      id: "4",
      title: "4º Trimestre",
      months: months.slice(9, 12),
      stats: calculateQuarterStats(4)
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
          <Tabs defaultValue={selectedQuarter} value={selectedQuarter} onValueChange={setSelectedQuarter} className="w-full col-span-1 md:col-span-2">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-8 bg-neutral-100 p-1 rounded-xl">
              {quarters.map((quarter) => (
                <TabsTrigger 
                  key={quarter.id} 
                  value={quarter.id} 
                  className="text-sm py-3 data-[state=active]:bg-neutral-800 data-[state=active]:text-white"
                >
                  {quarter.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {quarters.map((quarter) => (
              <TabsContent key={quarter.id} value={quarter.id} className="mt-0">
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-neutral-100">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {quarter.title}
                      </h3>
                      <span className="bg-neutral-50 px-3 py-1 rounded-lg text-sm text-neutral-600">
                        {currentYear}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-neutral-50 p-4 rounded-xl">
                        <p className="text-sm text-neutral-500 mb-1">Horas previstas</p>
                        <p className="text-xl font-bold text-neutral-900">{quarter.stats.planned}h</p>
                      </div>
                      
                      <div className="bg-neutral-50 p-4 rounded-xl">
                        <p className="text-sm text-neutral-500 mb-1">Horas trabalhadas</p>
                        <p className="text-xl font-bold text-neutral-900">{quarter.stats.worked}h</p>
                      </div>

                      <div className="bg-neutral-50 p-4 rounded-xl">
                        <p className="text-sm text-neutral-500 mb-1">Saldo</p>
                        <p className={`text-xl font-bold ${quarter.stats.balance >= 0 ? 'text-success' : 'text-danger'}`}>
                          {quarter.stats.balance >= 0 ? '+' : ''}{quarter.stats.balance}h
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
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
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-neutral-500">Horas previstas</p>
                      <span className="text-sm font-medium text-neutral-700">160h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-neutral-500">Horas trabalhadas</p>
                      <span className="text-sm font-medium text-neutral-700">165h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-neutral-500">Saldo</p>
                      <span className="text-sm font-medium text-success">+5h</span>
                    </div>
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
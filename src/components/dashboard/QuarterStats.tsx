import { Card } from "@/components/ui/card";
import { calculateMonthStats } from "@/utils/monthCalculations";
import { startOfMonth, endOfMonth, format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Database } from "@/integrations/supabase/types";

type Shift = Database["public"]["Tables"]["shifts"]["Row"];
type NonAccountingDay = Database["public"]["Tables"]["non_accounting_days"]["Row"];

interface QuarterStatsProps {
  quarter: number;
  year: number;
  shifts: Shift[];
  nonAccountingDays: NonAccountingDay[];
}

const QuarterStats = ({ quarter, year, shifts, nonAccountingDays }: QuarterStatsProps) => {
  const startMonth = (quarter - 1) * 3;
  const months = Array.from({ length: 3 }, (_, i) => startMonth + i);
  
  const quarterStats = months.reduce((acc, month) => {
    const currentDate = new Date(year, month, 1);
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    
    // Filter shifts for current month
    const monthShifts = shifts.filter(shift => {
      const shiftDate = parseISO(shift.date);
      return shiftDate >= monthStart && shiftDate <= monthEnd;
    });

    // Filter and count non-accounting days for current month
    const monthNonAccountingDays = nonAccountingDays.reduce((count, day) => {
      const startDate = parseISO(day.start_date);
      const endDate = parseISO(day.end_date);
      
      // Check if the non-accounting day period intersects with current month
      if (startDate <= monthEnd && endDate >= monthStart) {
        // Calculate days within this month
        const effectiveStart = startDate < monthStart ? monthStart : startDate;
        const effectiveEnd = endDate > monthEnd ? monthEnd : endDate;
        const daysInMonth = Math.ceil((effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return count + daysInMonth;
      }
      return count;
    }, 0);

    const stats = calculateMonthStats(currentDate, monthShifts, monthNonAccountingDays);
    
    return {
      expectedHours: acc.expectedHours + stats.expectedHours,
      workedHours: acc.workedHours + stats.workedHours,
    };
  }, { expectedHours: 0, workedHours: 0 });

  const formatHours = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h${minutes > 0 ? minutes.toString().padStart(2, '0') + 'min' : ''}`;
  };

  const balance = quarterStats.workedHours - quarterStats.expectedHours;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-neutral-100 mt-20">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">
            {quarter}º Trimestre
          </h3>
          <span className="bg-neutral-50 px-3 py-1 rounded-lg text-sm text-neutral-600">
            {year}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-neutral-50 p-4 rounded-xl">
            <p className="text-sm text-neutral-500 mb-1">Horas previstas</p>
            <p className="text-xl font-bold text-neutral-900">{formatHours(quarterStats.expectedHours)}</p>
          </div>
          
          <div className="bg-neutral-50 p-4 rounded-xl">
            <p className="text-sm text-neutral-500 mb-1">Horas trabalhadas</p>
            <p className="text-xl font-bold text-neutral-900">{formatHours(quarterStats.workedHours)}</p>
          </div>

          <div className="bg-neutral-50 p-4 rounded-xl">
            <p className="text-sm text-neutral-500 mb-1">Saldo</p>
            <p className={`text-xl font-bold ${balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {balance >= 0 ? '+' : ''}{formatHours(Math.abs(balance))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuarterStats;
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { calculateMonthStats } from "@/utils/monthCalculations";
import { startOfMonth, endOfMonth, format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";
import { calculateTotalHours } from "@/utils/timeCalculations";

type Shift = Database["public"]["Tables"]["shifts"]["Row"];
type NonAccountingDay = Database["public"]["Tables"]["non_accounting_days"]["Row"];

interface MonthCardProps {
  month: number;
  year: number;
  shifts: Shift[];
  nonAccountingDays: NonAccountingDay[];
}

const MonthCard = ({ month, year, shifts, nonAccountingDays }: MonthCardProps) => {
  const currentDate = new Date(year, month, 1);
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  // Filtra os turnos do mês atual
  const monthShifts = shifts.filter(shift => {
    const shiftDate = new Date(shift.date);
    return shiftDate >= monthStart && shiftDate <= monthEnd;
  });

  // Calcula dias não contábeis para o mês atual
  const monthNonAccountingDays = nonAccountingDays.reduce((count, day) => {
    const startDate = new Date(day.start_date);
    const endDate = new Date(day.end_date);
    
    if (startDate <= monthEnd && endDate >= monthStart) {
      const effectiveStart = startDate < monthStart ? monthStart : startDate;
      const effectiveEnd = endDate > monthEnd ? monthEnd : endDate;
      const daysInMonth = Math.ceil((effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return count + daysInMonth;
    }
    return count;
  }, 0);

  const stats = calculateMonthStats(currentDate, monthShifts, monthNonAccountingDays);

  const formatHours = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    if (minutes === 0) return `${wholeHours}h`;
    return `${wholeHours}h${minutes.toString().padStart(2, '0')}min`;
  };

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  return (
    <Link to={`/month/${month + 1}`} className="group block">
      <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-neutral-100 group-hover:border-primary">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-medium text-neutral-900">{months[month]}</h3>
          <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-primary transition-colors" />
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm text-neutral-500">Horas previstas</p>
            <span className="text-sm font-medium text-neutral-700">{formatHours(stats.expectedHours)}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-neutral-500">Horas trabalhadas</p>
            <span className="text-sm font-medium text-neutral-700">{formatHours(stats.workedHours)}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-neutral-500">Saldo</p>
            <span className={`text-sm font-medium ${stats.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {stats.balance >= 0 ? '+' : ''}{formatHours(Math.abs(stats.balance))}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MonthCard;
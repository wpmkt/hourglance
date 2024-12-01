import { Card } from "@/components/ui/card";
import { Calendar, TrendingDown } from "lucide-react";

interface MonthlySummaryProps {
  daysInMonth: number;
  nonAccountingDays: number;
  workingDays: number;
  expectedHours: number;
  workedHours: number;
}

const MonthlySummary = ({
  daysInMonth,
  nonAccountingDays,
  workingDays,
  expectedHours,
  workedHours,
}: MonthlySummaryProps) => {
  const hoursBalance = workedHours - expectedHours;
  
  return (
    <div className="space-y-6 mb-6">
      <div className="bg-white text-neutral-900 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-neutral-100">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-neutral-500 mb-1">Saldo Atual</p>
            <h3 className="text-3xl font-bold text-neutral-900">{hoursBalance.toFixed(1)}h</h3>
          </div>
          <span className="bg-neutral-50 px-3 py-1 rounded-lg text-sm text-neutral-600">
            {new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-neutral-500 text-sm mb-1">Horas Previstas</p>
            <p className="text-xl font-semibold text-neutral-900">{expectedHours.toFixed(1)}h</p>
          </div>
          <div>
            <p className="text-neutral-500 text-sm mb-1">Horas Trabalhadas</p>
            <p className="text-xl font-semibold text-neutral-900">{workedHours.toFixed(1)}h</p>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Status do Mês</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-neutral-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-neutral-50 p-2 rounded-xl">
              <Calendar className="w-5 h-5 text-neutral-600" />
            </div>
            <h3 className="text-sm font-medium text-neutral-700">Dias</h3>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-2xl font-bold text-neutral-900">{daysInMonth}</p>
              <p className="text-sm text-neutral-500">Total</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-neutral-900">{workingDays}</p>
              <p className="text-sm text-neutral-500">A Trabalhar</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-neutral-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-neutral-50 p-2 rounded-xl">
              <TrendingDown className="w-5 h-5 text-neutral-600" />
            </div>
            <h3 className="text-sm font-medium text-neutral-700">Não Contábeis</h3>
          </div>
          <p className="text-2xl font-bold text-neutral-900">{nonAccountingDays}</p>
          <p className="text-sm text-neutral-500">Dias</p>
        </div>
      </div>
    </div>
  );
};

export default MonthlySummary;
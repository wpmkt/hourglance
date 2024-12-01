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
      <div className="bg-blue-600 text-white rounded-3xl p-6 shadow-lg">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-blue-100 mb-1">Saldo Atual</p>
            <h3 className="text-3xl font-bold">{hoursBalance.toFixed(1)}h</h3>
          </div>
          <span className="bg-blue-500 px-3 py-1 rounded-lg text-sm">
            {new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-blue-200 text-sm mb-1">Horas Previstas</p>
            <p className="text-xl font-semibold">{expectedHours.toFixed(1)}h</p>
          </div>
          <div>
            <p className="text-blue-200 text-sm mb-1">Horas Trabalhadas</p>
            <p className="text-xl font-semibold">{workedHours.toFixed(1)}h</p>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">Status do Mês</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-violet-100 p-2 rounded-xl">
              <Calendar className="w-5 h-5 text-violet-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">Dias</h3>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-2xl font-bold text-gray-900">{daysInMonth}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{workingDays}</p>
              <p className="text-sm text-gray-500">A Trabalhar</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-red-100 p-2 rounded-xl">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">Não Contábeis</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{nonAccountingDays}</p>
          <p className="text-sm text-gray-500">Dias</p>
        </div>
      </div>
    </div>
  );
};

export default MonthlySummary;
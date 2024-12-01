import { Card } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

interface MonthSummaryProps {
  daysInMonth: number;
  nonAccountingDays: number;
  workingDays: number;
  expectedHours: number;
  workedHours: number;
}

const formatHours = (hours: number) => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return `${wholeHours}h${minutes > 0 ? minutes.toString().padStart(2, '0') + 'min' : ''}`;
};

const MonthSummary = ({
  daysInMonth,
  nonAccountingDays,
  workingDays,
  expectedHours,
  workedHours
}: MonthSummaryProps) => {
  const balance = workedHours - expectedHours;
  
  return (
    <>
      <Card className="bg-white rounded-xl p-6 mb-6 shadow-sm hover:shadow-md transition-all duration-200 border border-neutral-100">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-neutral-500" />
          <h2 className="text-lg font-medium text-neutral-800">Dias do Mês</h2>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-neutral-600">Dias Previstos</span>
            <span className="font-medium text-neutral-800">{daysInMonth}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Dias Não Contábeis</span>
            <span className="font-medium text-neutral-800">{nonAccountingDays}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Dias a Trabalhar</span>
            <span className="font-medium text-neutral-700">{workingDays}</span>
          </div>
        </div>
      </Card>

      <Card className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-neutral-100">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-neutral-500" />
          <h2 className="text-lg font-medium text-neutral-800">Horas do Mês</h2>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-neutral-600">Horas Previstas</span>
            <span className="font-medium text-neutral-800">{formatHours(expectedHours)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Horas Trabalhadas</span>
            <span className="font-medium text-neutral-800">{formatHours(workedHours)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Saldo</span>
            <span className="font-medium text-neutral-700">
              {formatHours(balance)}
            </span>
          </div>
        </div>
      </Card>
    </>
  );
};

export default MonthSummary;
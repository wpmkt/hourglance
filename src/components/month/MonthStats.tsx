import { Calendar, Clock } from "lucide-react";

interface MonthStatsProps {
  daysInMonth: number;
  nonAccountingDays: number;
  workingDays: number;
  expectedHours: number;
  workedHours: number;
}

const MonthStats = ({ 
  daysInMonth, 
  nonAccountingDays, 
  workingDays,
  expectedHours,
  workedHours
}: MonthStatsProps) => {
  return (
    <>
      <div className="bg-white rounded-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-[#8B5CF6]" />
          <h2 className="text-lg font-medium text-gray-900">Dias do Mês</h2>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Dias Previstos</span>
            <span className="font-medium text-gray-900">{daysInMonth}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Dias Não Contábeis</span>
            <span className="font-medium text-gray-900">{nonAccountingDays}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Dias a Trabalhar</span>
            <span className="font-medium text-[#8B5CF6]">{workingDays}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-[#8B5CF6]" />
          <h2 className="text-lg font-medium text-gray-900">Horas do Mês</h2>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Horas Previstas</span>
            <span className="font-medium text-gray-900">{expectedHours.toFixed(1)}h</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Horas Trabalhadas</span>
            <span className="font-medium text-gray-900">{workedHours.toFixed(1)}h</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Saldo</span>
            <span className="font-medium text-[#8B5CF6]">
              {(workedHours - expectedHours).toFixed(1)}h
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default MonthStats;
import { Card } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="p-6 hover:shadow-lg transition-shadow duration-200 bg-white/80 backdrop-blur-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-neutral-500">Dias Previstos</h4>
            <Calendar className="h-4 w-4 text-blue-500" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <p className="text-2xl font-semibold text-blue-700">{daysInMonth}</p>
              <p className="text-sm text-neutral-500">Total</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <p className="text-2xl font-semibold text-blue-700">{nonAccountingDays}</p>
              <p className="text-sm text-neutral-500">Não Contábeis</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <p className="text-2xl font-semibold text-blue-700">{workingDays}</p>
              <p className="text-sm text-neutral-500">A Trabalhar</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-shadow duration-200 bg-white/80 backdrop-blur-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-neutral-500">Horas Previstas</h4>
            <Clock className="h-4 w-4 text-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <p className="text-2xl font-semibold text-blue-700">{expectedHours.toFixed(1)}</p>
              <p className="text-sm text-neutral-500">Previstas</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <p className="text-2xl font-semibold text-blue-700">{workedHours.toFixed(1)}</p>
              <p className="text-sm text-neutral-500">Trabalhadas</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-shadow duration-200 bg-white/80 backdrop-blur-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-neutral-500">Saldo</h4>
            <Clock className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <p className={`text-3xl font-semibold ${
              hoursBalance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {hoursBalance.toFixed(1)}h
            </p>
            <p className="text-sm text-neutral-500">
              {hoursBalance >= 0 ? 'Positivo' : 'Negativo'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MonthlySummary;
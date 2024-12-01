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
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-neutral-500">Dias Previstos</h4>
            <Calendar className="h-4 w-4 text-neutral-500" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-semibold">{daysInMonth}</p>
              <p className="text-sm text-neutral-500">Total</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{nonAccountingDays}</p>
              <p className="text-sm text-neutral-500">Não Contábeis</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{workingDays}</p>
              <p className="text-sm text-neutral-500">A Trabalhar</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-neutral-500">Horas Previstas</h4>
            <Clock className="h-4 w-4 text-neutral-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-semibold">{expectedHours.toFixed(1)}</p>
              <p className="text-sm text-neutral-500">Previstas</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{workedHours.toFixed(1)}</p>
              <p className="text-sm text-neutral-500">Trabalhadas</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-neutral-500">Saldo</h4>
            <Clock className="h-4 w-4 text-neutral-500" />
          </div>
          <div>
            <p className={`text-3xl font-semibold ${
              hoursBalance >= 0 ? 'text-green-500' : 'text-red-500'
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
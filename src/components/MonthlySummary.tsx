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
  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h4 className="text-sm font-medium text-neutral-500">Dias Previstos</h4>
          <div className="mt-1 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-neutral-500" />
            <span className="text-2xl font-semibold">{daysInMonth}</span>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-neutral-500">Dias Não Contábeis</h4>
          <div className="mt-1 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-neutral-500" />
            <span className="text-2xl font-semibold">{nonAccountingDays}</span>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-neutral-500">Dias a Trabalhar</h4>
          <div className="mt-1 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-neutral-500" />
            <span className="text-2xl font-semibold">{workingDays}</span>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-neutral-500">Horas Previstas</h4>
          <div className="mt-1 flex items-center gap-2">
            <Clock className="h-4 w-4 text-neutral-500" />
            <span className="text-2xl font-semibold">{expectedHours.toFixed(1)}</span>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-neutral-500">Horas Trabalhadas</h4>
          <div className="mt-1 flex items-center gap-2">
            <Clock className="h-4 w-4 text-neutral-500" />
            <span className="text-2xl font-semibold">{workedHours.toFixed(1)}</span>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-neutral-500">Saldo</h4>
          <div className="mt-1 flex items-center gap-2">
            <Clock className="h-4 w-4 text-neutral-500" />
            <span
              className={`text-2xl font-semibold ${
                workedHours - expectedHours >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {(workedHours - expectedHours).toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MonthlySummary;
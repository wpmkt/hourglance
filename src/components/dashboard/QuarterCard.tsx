import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface QuarterStats {
  expectedHours: number;
  workedHours: number;
  balance: number;
}

interface QuarterCardProps {
  quarter: {
    id: string;
    title: string;
  };
  stats: QuarterStats;
  currentYear: number;
}

export const QuarterCard = ({ quarter, stats, currentYear }: QuarterCardProps) => {
  return (
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
            <p className="text-xl font-bold text-neutral-900">{stats.expectedHours.toFixed(1)}h</p>
          </div>
          
          <div className="bg-neutral-50 p-4 rounded-xl">
            <p className="text-sm text-neutral-500 mb-1">Horas trabalhadas</p>
            <p className="text-xl font-bold text-neutral-900">{stats.workedHours.toFixed(1)}h</p>
          </div>

          <div className="bg-neutral-50 p-4 rounded-xl">
            <p className="text-sm text-neutral-500 mb-1">Saldo</p>
            <p className={`text-xl font-bold ${stats.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {stats.balance >= 0 ? '+' : ''}{stats.balance.toFixed(1)}h
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
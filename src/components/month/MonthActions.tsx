import { Calendar } from "lucide-react";

interface MonthActionsProps {
  onOpenShiftDialog: () => void;
  onOpenNonAccountingDialog: () => void;
}

const MonthActions = ({ onOpenShiftDialog, onOpenNonAccountingDialog }: MonthActionsProps) => {
  return (
    <div className="space-y-3 mb-6">
      <button 
        onClick={onOpenShiftDialog}
        className="w-full bg-white text-neutral-700 py-3 rounded-xl font-medium border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-200 hover:bg-neutral-50 flex items-center justify-center gap-2"
      >
        + Turno
      </button>
      <button
        onClick={onOpenNonAccountingDialog}
        className="w-full bg-white/80 text-neutral-700 py-3 rounded-xl font-medium border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-200 hover:bg-neutral-50 flex items-center justify-center gap-2"
      >
        <Calendar className="w-5 h-5" />
        Lançar Dia Não Contábil
      </button>
    </div>
  );
};

export default MonthActions;
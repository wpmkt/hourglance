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
        className="w-full bg-white text-indigo-600 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
      >
        + Turno
      </button>
      <button
        onClick={onOpenNonAccountingDialog}
        className="w-full bg-white/20 text-white py-3 rounded-lg font-medium hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
      >
        <Calendar className="w-5 h-5" />
        Lançar Dia Não Contábil
      </button>
    </div>
  );
};

export default MonthActions;
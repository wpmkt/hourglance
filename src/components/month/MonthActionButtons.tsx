import { Shield, Calendar } from "lucide-react";

interface MonthActionButtonsProps {
  onOpenShiftDialog: () => void;
  onOpenNonAccountingDialog: () => void;
}

const MonthActionButtons = ({ onOpenShiftDialog, onOpenNonAccountingDialog }: MonthActionButtonsProps) => {
  return (
    <div className="space-y-3 mb-6">
      <button 
        onClick={onOpenShiftDialog}
        className="w-full bg-neutral-800 text-white py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:bg-neutral-700 flex items-center justify-center gap-2"
      >
        <Shield className="w-5 h-5" />
        Turno
      </button>
      <button
        onClick={onOpenNonAccountingDialog}
        className="w-full bg-neutral-700 text-white py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:bg-neutral-600 flex items-center justify-center gap-2"
      >
        <Calendar className="w-5 h-5" />
        Lançar Dia Não Contábil
      </button>
    </div>
  );
};

export default MonthActionButtons;
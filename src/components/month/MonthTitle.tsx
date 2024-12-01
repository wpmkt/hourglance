import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

interface MonthTitleProps {
  currentDate: Date;
  onExportPDF: () => void;
}

const MonthTitle = ({ currentDate, onExportPDF }: MonthTitleProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-semibold text-neutral-800">
        {format(currentDate, "MMMM'/'yyyy", { locale: ptBR })}
      </h1>
      <Button
        onClick={onExportPDF}
        className="bg-neutral-800 text-white hover:bg-neutral-700 flex items-center gap-2 rounded-xl px-4 py-2 transition-colors duration-200"
      >
        <FileDown className="w-4 h-4" />
        Exportar PDF
      </Button>
    </div>
  );
};

export default MonthTitle;
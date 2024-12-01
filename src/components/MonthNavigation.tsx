import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface MonthNavigationProps {
  currentDate: Date;
  onNavigate: (direction: "prev" | "next") => void;
}

const MonthNavigation = ({ currentDate, onNavigate }: MonthNavigationProps) => {
  const date = currentDate instanceof Date && !isNaN(currentDate.getTime()) 
    ? currentDate 
    : new Date();

  return (
    <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm mb-6">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
        {format(date, "MMMM 'de' yyyy", { locale: ptBR })}
      </h1>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => onNavigate("prev")}
          className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => onNavigate("next")}
          className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MonthNavigation;
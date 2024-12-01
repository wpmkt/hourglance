import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MonthNavigationProps {
  currentDate: Date;
  onNavigate: (direction: "prev" | "next") => void;
}

const MonthNavigation = ({ currentDate, onNavigate }: MonthNavigationProps) => {
  const date = currentDate instanceof Date && !isNaN(currentDate.getTime()) 
    ? currentDate 
    : new Date();

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Search className="w-6 h-6 text-gray-600" />
        </button>
      </div>
      <div className="flex items-center gap-3 mb-6">
        <button 
          className="p-2 hover:bg-gray-100 rounded-full"
          onClick={() => onNavigate("prev")}
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-sm text-gray-500">Bem-vindo de volta</h2>
          <h1 className="text-xl font-semibold text-gray-900">
            {format(date, "MMMM 'de' yyyy", { locale: ptBR })}
          </h1>
        </div>
      </div>
    </>
  );
};

export default MonthNavigation;
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface MonthNavigationProps {
  currentDate: Date;
  onNavigate: (direction: "prev" | "next") => void;
}

const MonthNavigation = ({ currentDate, onNavigate }: MonthNavigationProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">
        {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
      </h1>
      <div className="flex gap-2">
        <Button variant="outline" size="icon" onClick={() => onNavigate("prev")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onNavigate("next")}>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MonthNavigation;
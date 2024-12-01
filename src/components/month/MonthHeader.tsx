import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MonthHeaderProps {
  currentDate: Date;
}

const MonthHeader = ({ currentDate }: MonthHeaderProps) => {
  return (
    <h1 className="text-2xl font-semibold text-neutral-800 mb-6">
      {format(currentDate, "MMMM'/'yyyy", { locale: ptBR })}
    </h1>
  );
};

export default MonthHeader;
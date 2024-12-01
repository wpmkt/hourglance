import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface MonthHeaderProps {
  currentDate: Date;
}

const MonthHeader = ({ currentDate }: MonthHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <h1 className="text-2xl font-semibold text-white mb-6">
      {format(currentDate, "MMMM'/'yyyy", { locale: ptBR })}
    </h1>
  );
};

export default MonthHeader;
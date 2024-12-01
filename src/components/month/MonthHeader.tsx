import { ArrowLeft, LogOut } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface MonthHeaderProps {
  currentDate: Date;
}

const MonthHeader = ({ currentDate }: MonthHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-4">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar
      </button>
      <button 
        onClick={() => navigate("/login")}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
      >
        Sair
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  );
};

export default MonthHeader;
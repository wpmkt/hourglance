import { format, parseISO } from "date-fns";
import { Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ShiftItemProps {
  shift: {
    id: string;
    date: string;
    start_time: string;
    end_time: string;
    comment?: string;
  };
  nightMinutes: number;
  totalHours: number;
  onDelete: (id: string) => void;
}

const ShiftItem = ({ shift, nightMinutes, totalHours, onDelete }: ShiftItemProps) => {
  const formatDuration = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h${minutes.toString().padStart(2, '0')}min`;
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900">
              {format(parseISO(shift.date), "dd/MM/yyyy")}
            </p>
            <div className="flex items-center gap-1 text-sm text-[#8B5CF6] bg-[#8B5CF6]/10 px-2 py-0.5 rounded-lg">
              <Clock className="w-3 h-3" />
              {shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}
            </div>
          </div>
          {nightMinutes > 0 && (
            <p className="text-sm text-[#8B5CF6] mt-1">
              Minutos noturnos: {nightMinutes}min
            </p>
          )}
          {shift.comment && (
            <p className="text-sm text-gray-500 mt-1">
              {shift.comment}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900">
            {formatDuration(totalHours)}
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-gray-400 hover:text-red-500 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir este turno? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-gray-200">Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => onDelete(shift.id)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default ShiftItem;
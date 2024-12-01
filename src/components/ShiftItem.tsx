import { format, parseISO } from "date-fns";
import { Trash2 } from "lucide-react";
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
    <div className="bg-neutral-50 rounded-lg p-4 hover:bg-neutral-100 transition-colors border border-neutral-200">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-neutral-900">
              {format(parseISO(shift.date), "dd/MM/yyyy")}
            </p>
            <p className="text-sm text-neutral-600 bg-neutral-200 px-2 py-0.5 rounded">
              {shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}
            </p>
          </div>
          {nightMinutes > 0 && (
            <p className="text-sm text-blue-600 mt-1">
              Minutos noturnos: {nightMinutes}min
            </p>
          )}
          {shift.comment && (
            <p className="text-sm text-neutral-500 mt-1 italic">
              "{shift.comment}"
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <p className="font-medium text-neutral-900">
            {formatDuration(totalHours)}
          </p>
          <p className="text-sm text-neutral-600">trabalhadas</p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-red-500 hover:text-red-700 hover:bg-red-100 mt-1"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir este turno? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
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
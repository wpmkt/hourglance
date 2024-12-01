import { format, parseISO } from "date-fns";
import { Trash2, Clock, Pencil, Moon } from "lucide-react";
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
  onEdit: (shift: any) => void;
}

const ShiftItem = ({ shift, nightMinutes, totalHours, onDelete, onEdit }: ShiftItemProps) => {
  const formatDuration = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h${minutes.toString().padStart(2, '0')}min`;
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-neutral-200 hover:bg-neutral-50">
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between items-center">
          <div className="bg-neutral-100 text-neutral-700 px-3 py-1.5 rounded-lg font-medium">
            {format(parseISO(shift.date), "dd/MM/yyyy")}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 h-8 w-8"
              onClick={() => onEdit(shift)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white p-6 max-w-[90vw] w-full sm:max-w-[425px] rounded-2xl border-none shadow-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-2xl font-semibold text-neutral-900">
                    Confirmar exclusão
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-neutral-500 mt-2">
                    Tem certeza que deseja excluir este turno? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-8">
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <AlertDialogCancel className="w-full sm:w-1/2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border-0">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => onDelete(shift.id)}
                      className="w-full sm:w-1/2 bg-red-500 hover:bg-red-600 text-white border-0"
                    >
                      Excluir
                    </AlertDialogAction>
                  </div>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-neutral-100 px-3 py-1.5 rounded-lg text-sm">
            <Clock className="h-4 w-4 text-neutral-500 flex-shrink-0" />
            <span className="text-neutral-700 whitespace-nowrap">
              {shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-lg font-semibold text-neutral-700">
              {formatDuration(totalHours)}
            </div>
            
            {nightMinutes > 0 && (
              <div className="flex items-center gap-2 bg-neutral-100 px-3 py-1.5 rounded-lg">
                <Moon className="h-4 w-4 text-neutral-500 flex-shrink-0" />
                <span className="text-neutral-700 font-medium text-sm whitespace-nowrap">
                  {nightMinutes}min
                </span>
              </div>
            )}
          </div>
        </div>

        {shift.comment && (
          <div className="text-sm text-neutral-600 bg-neutral-100 p-2 rounded-lg break-words">
            {shift.comment}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftItem;
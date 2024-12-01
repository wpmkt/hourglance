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
  onEdit?: (shift: any) => void;
}

const ShiftItem = ({ shift, nightMinutes, totalHours, onDelete, onEdit }: ShiftItemProps) => {
  const formatDuration = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h${minutes.toString().padStart(2, '0')}min`;
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-purple-100">
      <div className="flex flex-col space-y-3">
        {/* Header with date and actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg font-medium">
              {format(parseISO(shift.date), "dd/MM/yyyy")}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button 
                variant="ghost" 
                size="icon"
                className="text-purple-500 hover:text-purple-700 hover:bg-purple-50"
                onClick={() => onEdit(shift)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white mx-4">
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

        {/* Time information */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">
                {shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}
              </span>
            </div>
            <div className="text-lg font-semibold text-purple-700">
              {formatDuration(totalHours)}
            </div>
          </div>
          {nightMinutes > 0 && (
            <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-lg">
              <Moon className="h-4 w-4 text-indigo-500" />
              <span className="text-indigo-700 font-medium">
                {nightMinutes}min
              </span>
            </div>
          )}
        </div>

        {/* Comment if exists */}
        {shift.comment && (
          <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded-lg">
            {shift.comment}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftItem;
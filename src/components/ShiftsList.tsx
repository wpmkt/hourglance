import { format, parseISO } from "date-fns";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface Shift {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  comment?: string;
}

interface ShiftsListProps {
  shifts: Shift[];
}

const ShiftsList = ({ shifts }: ShiftsListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const calculateHours = (start: string, end: string) => {
    const startDate = new Date(`1970-01-01T${start}`);
    const endDate = new Date(`1970-01-01T${end}`);
    return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("shifts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Turno excluído com sucesso!",
        description: "O registro foi removido.",
      });

      queryClient.invalidateQueries({ queryKey: ["month-data"] });
    } catch (error) {
      toast({
        title: "Erro ao excluir turno",
        description: "Ocorreu um erro ao excluir o registro. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="h-[400px] flex flex-col">
      <div className="p-4 border-b border-neutral-200 flex items-center gap-2">
        <Clock className="h-5 w-5 text-neutral-500" />
        <h3 className="text-lg font-medium">Turnos Registrados</h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {shifts?.map((shift) => (
            <div 
              key={shift.id} 
              className="p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-neutral-900">
                    {format(parseISO(shift.date), "dd/MM/yyyy")}
                  </p>
                  <p className="text-sm text-neutral-600">
                    {shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}
                  </p>
                  {shift.comment && (
                    <p className="text-sm text-neutral-500 mt-1 italic">
                      "{shift.comment}"
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="font-medium text-neutral-900">
                    {calculateHours(shift.start_time, shift.end_time).toFixed(1)}h
                  </p>
                  <p className="text-sm text-neutral-600">trabalhadas</p>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-100"
                    onClick={() => handleDelete(shift.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {(!shifts || shifts.length === 0) && (
            <div className="flex flex-col items-center justify-center py-8 text-neutral-500">
              <Clock className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-center">
                Nenhum turno registrado
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ShiftsList;
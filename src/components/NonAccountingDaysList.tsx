import { format, parseISO } from "date-fns";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
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

interface NonAccountingDay {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
}

interface NonAccountingDaysListProps {
  nonAccountingDays: NonAccountingDay[];
  onEdit?: (day: NonAccountingDay) => void;
}

const NonAccountingDaysList = ({ nonAccountingDays, onEdit }: NonAccountingDaysListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('non_accounting_days')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir dia não contábil:', error);
        throw error;
      }

      toast({
        title: "Registro excluído com sucesso!",
        description: "O dia não contábil foi removido.",
      });

      await queryClient.invalidateQueries({ queryKey: ["month-data"] });
    } catch (error) {
      console.error('Erro ao excluir dia não contábil:', error);
      toast({
        title: "Erro ao excluir registro",
        description: "Ocorreu um erro ao excluir o dia não contábil. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="h-[400px] flex flex-col bg-white">
      <div className="p-4 border-b border-neutral-200 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-[#8B5CF6]" />
        <h3 className="text-lg font-medium text-gray-900">Dias Não Contábeis</h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {nonAccountingDays?.map((day) => (
            <div 
              key={day.id} 
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{day.reason}</p>
                  <p className="text-sm text-gray-600">
                    {format(parseISO(day.start_date), "dd/MM/yyyy")} -{" "}
                    {format(parseISO(day.end_date), "dd/MM/yyyy")}
                  </p>
                </div>
                <div className="flex gap-2">
                  {onEdit && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-100"
                      onClick={() => onEdit(day)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir este dia não contábil? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(day.id)}
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
          ))}
          {(!nonAccountingDays || nonAccountingDays.length === 0) && (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <Calendar className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-center">
                Nenhum dia não contábil registrado
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default NonAccountingDaysList;
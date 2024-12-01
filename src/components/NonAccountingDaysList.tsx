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

      if (error) throw error;

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
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-purple-100"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                  <div className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg font-medium inline-block">
                    {format(parseISO(day.start_date), "dd/MM/yyyy")} -{" "}
                    {format(parseISO(day.end_date), "dd/MM/yyyy")}
                  </div>
                  <p className="text-gray-700">{day.reason}</p>
                </div>
                <div className="flex gap-2">
                  {onEdit && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-purple-500 hover:text-purple-700 hover:bg-purple-50 h-8 w-8"
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
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white p-6 max-w-[90vw] w-full sm:max-w-[425px] rounded-2xl border-none shadow-xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-semibold text-gray-900">
                          Confirmar exclusão
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-500 mt-2">
                          Tem certeza que deseja excluir este dia não contábil? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-8">
                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                          <AlertDialogCancel className="w-full sm:w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-900 border-0">
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(day.id)}
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
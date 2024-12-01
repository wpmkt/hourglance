import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

type ShiftInsert = Database["public"]["Tables"]["shifts"]["Insert"];

interface ShiftDialogProps {
  currentDate?: Date;
}

export function ShiftDialog({ currentDate = new Date() }: ShiftDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(currentDate.toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const newShift: ShiftInsert = {
        date,
        start_time: startTime,
        end_time: endTime,
        comment: comment || null,
        user_id: user.id
      };

      const { error } = await supabase
        .from("shifts")
        .insert(newShift);

      if (error) throw error;

      toast({
        title: "Turno registrado com sucesso!",
        description: "O turno foi salvo e já está disponível para consulta.",
      });

      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["month-data"] });
    } catch (error) {
      toast({
        title: "Erro ao registrar turno",
        description: "Ocorreu um erro ao salvar o turno. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Turno
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white p-6 rounded-2xl border-0 shadow-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-semibold text-gray-900">Lançar Turno</DialogTitle>
            <DialogDescription className="text-gray-500 mt-2">
              Registre as horas trabalhadas no dia.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right text-gray-700">
                Data
              </Label>
              <Input
                id="date"
                type="date"
                className="col-span-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start" className="text-right text-gray-700">
                Início
              </Label>
              <Input
                id="start"
                type="time"
                className="col-span-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end" className="text-right text-gray-700">
                Fim
              </Label>
              <Input
                id="end"
                type="time"
                className="col-span-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="comment" className="text-right text-gray-700">
                Comentário
              </Label>
              <Input
                id="comment"
                className="col-span-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Opcional"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="mt-8">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3"
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
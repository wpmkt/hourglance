import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

type ShiftInsert = Database["public"]["Tables"]["shifts"]["Insert"];

interface ShiftDialogProps {
  currentDate?: Date;
  editData?: {
    id: string;
    date: string;
    start_time: string;
    end_time: string;
    comment?: string;
  };
}

export function ShiftDialog({ currentDate = new Date(), editData }: ShiftDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(editData?.date || currentDate.toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(editData?.start_time?.slice(0, 5) || "");
  const [endTime, setEndTime] = useState(editData?.end_time?.slice(0, 5) || "");
  const [comment, setComment] = useState(editData?.comment || "");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (editData) {
      setDate(editData.date);
      setStartTime(editData.start_time.slice(0, 5));
      setEndTime(editData.end_time.slice(0, 5));
      setComment(editData.comment || "");
    }
  }, [editData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const shiftData = {
        date,
        start_time: startTime,
        end_time: endTime,
        comment: comment || null,
        user_id: user.id
      };

      let error;

      if (editData?.id) {
        ({ error } = await supabase
          .from("shifts")
          .update(shiftData)
          .eq('id', editData.id));
      } else {
        ({ error } = await supabase
          .from("shifts")
          .insert(shiftData));
      }

      if (error) throw error;

      toast({
        title: editData ? "Turno atualizado com sucesso!" : "Turno registrado com sucesso!",
        description: editData ? "As alterações foram salvas." : "O turno foi salvo e já está disponível para consulta.",
      });

      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["month-data"] });
    } catch (error) {
      console.error('Erro ao salvar turno:', error);
      toast({
        title: "Erro ao salvar turno",
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
        <button data-dialog-trigger="shift" className="hidden">
          Turno
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] mx-4 bg-white p-6 rounded-2xl border-none shadow-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-semibold text-gray-900">
              {editData ? "Editar Turno" : "Lançar Turno"}
            </DialogTitle>
            <DialogDescription className="text-gray-500 mt-2">
              {editData ? "Atualize as informações do turno." : "Registre as horas trabalhadas no dia."}
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
                className="col-span-3 rounded-xl border-gray-200 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]"
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
                className="col-span-3 rounded-xl border-gray-200 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]"
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
                className="col-span-3 rounded-xl border-gray-200 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]"
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
                className="col-span-3 rounded-xl border-gray-200 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]"
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
              className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl py-3"
            >
              {loading ? "Salvando..." : (editData ? "Atualizar" : "Salvar")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
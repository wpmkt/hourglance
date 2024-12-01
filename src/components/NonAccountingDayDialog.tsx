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

type NonAccountingDayInsert = Database["public"]["Tables"]["non_accounting_days"]["Insert"];

interface NonAccountingDayDialogProps {
  currentDate?: Date;
  editData?: {
    id: string;
    start_date: string;
    end_date: string;
    reason: string;
  };
}

export function NonAccountingDayDialog({ currentDate = new Date(), editData }: NonAccountingDayDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(editData?.start_date || currentDate.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(editData?.end_date || currentDate.toISOString().split('T')[0]);
  const [reason, setReason] = useState(editData?.reason || "");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (editData) {
      setStartDate(editData.start_date);
      setEndDate(editData.end_date);
      setReason(editData.reason);
    }
  }, [editData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const dayData = {
        start_date: startDate,
        end_date: endDate,
        reason,
        user_id: user.id
      };

      let error;

      if (editData?.id) {
        ({ error } = await supabase
          .from("non_accounting_days")
          .update(dayData)
          .eq('id', editData.id));
      } else {
        ({ error } = await supabase
          .from("non_accounting_days")
          .insert(dayData));
      }

      if (error) throw error;

      toast({
        title: editData ? "Dia não contábil atualizado com sucesso!" : "Dia não contábil registrado com sucesso!",
        description: editData ? "As alterações foram salvas." : "O registro foi salvo e já está disponível para consulta.",
      });

      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["month-data"] });
    } catch (error) {
      console.error('Erro ao salvar dia não contábil:', error);
      toast({
        title: "Erro ao salvar registro",
        description: "Ocorreu um erro ao salvar o registro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button data-dialog-trigger="non-accounting" className="hidden">
          Não Contábil
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] mx-4 bg-white p-6 rounded-2xl border-none shadow-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-semibold text-neutral-900">
              {editData ? "Editar Dia Não Contábil" : "Lançar Dia Não Contábil"}
            </DialogTitle>
            <DialogDescription className="text-neutral-500 mt-2">
              {editData ? "Atualize as informações do registro." : "Registre períodos de férias, licenças ou outros dias não contábeis."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right text-neutral-700">
                Data Inicial
              </Label>
              <Input
                id="startDate"
                type="date"
                className="col-span-3 rounded-xl border-neutral-200 focus:border-neutral-400 focus:ring-neutral-400"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right text-neutral-700">
                Data Final
              </Label>
              <Input
                id="endDate"
                type="date"
                className="col-span-3 rounded-xl border-neutral-200 focus:border-neutral-400 focus:ring-neutral-400"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right text-neutral-700">
                Motivo
              </Label>
              <Input
                id="reason"
                className="col-span-3 rounded-xl border-neutral-200 focus:border-neutral-400 focus:ring-neutral-400"
                placeholder="Ex: Férias, Licença"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter className="mt-8">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl py-3"
            >
              {loading ? "Salvando..." : (editData ? "Atualizar" : "Salvar")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
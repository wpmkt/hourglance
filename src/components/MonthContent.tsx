import { format, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShiftDialog } from "@/components/ShiftDialog";
import { NonAccountingDayDialog } from "@/components/NonAccountingDayDialog";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";
import MonthTitle from "./month/MonthTitle";
import MonthActionButtons from "./month/MonthActionButtons";
import MonthSummary from "./month/MonthSummary";
import ShiftsList from "./ShiftsList";
import NonAccountingDaysList from "./NonAccountingDaysList";
import { calculateMonthStats } from "@/utils/monthCalculations";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type Shift = Database["public"]["Tables"]["shifts"]["Row"];
type NonAccountingDay = Database["public"]["Tables"]["non_accounting_days"]["Row"];

interface MonthContentProps {
  currentDate: Date;
  userId: string;
}

const MonthContent = ({ currentDate, userId }: MonthContentProps) => {
  const { toast } = useToast();

  const fetchMonthData = async () => {
    try {
      if (!currentDate || !(currentDate instanceof Date) || isNaN(currentDate.getTime())) {
        throw new Error("Data inválida");
      }

      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      const startDate = format(start, "yyyy-MM-dd");
      const endDate = format(end, "yyyy-MM-dd");

      const [shiftsResponse, nonAccountingResponse] = await Promise.all([
        supabase
          .from("shifts")
          .select("*")
          .eq("user_id", userId)
          .gte("date", startDate)
          .lte("date", endDate)
          .order("date", { ascending: true }),
        supabase
          .from("non_accounting_days")
          .select("*")
          .eq("user_id", userId)
          .or(`start_date.lte.${endDate},end_date.gte.${startDate}`)
          .order("start_date", { ascending: true })
      ]);

      if (shiftsResponse.error) throw shiftsResponse.error;
      if (nonAccountingResponse.error) throw nonAccountingResponse.error;

      return {
        shifts: shiftsResponse.data as Shift[],
        nonAccountingDays: nonAccountingResponse.data as NonAccountingDay[]
      };
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      throw error;
    }
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["month-data", format(currentDate, "yyyy-MM"), userId],
    queryFn: fetchMonthData,
    enabled: !!userId && !!(currentDate instanceof Date) && !isNaN(currentDate.getTime()),
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  if (error) {
    console.error("Erro na query:", error);
    toast({
      title: "Erro ao carregar dados",
      description: "Ocorreu um erro ao carregar os dados do mês. Por favor, tente novamente.",
      variant: "destructive",
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-lg">Carregando dados...</div>
      </div>
    );
  }

  const safeData = {
    shifts: data?.shifts || [],
    nonAccountingDays: data?.nonAccountingDays || []
  };

  const calculateNonAccountingDays = () => {
    return safeData.nonAccountingDays.reduce((acc, day) => {
      const start = new Date(day.start_date);
      const end = new Date(day.end_date);
      return acc + (end.getDate() - start.getDate() + 1);
    }, 0);
  };

  const nonAccountingDays = calculateNonAccountingDays();
  const monthStats = calculateMonthStats(currentDate, safeData.shifts, nonAccountingDays);

  const handleEditShift = (shift: Shift) => {
    const dialogTrigger = document.querySelector<HTMLButtonElement>('[data-dialog-trigger="shift"]');
    if (dialogTrigger) {
      dialogTrigger.click();
    }
  };

  const handleEditNonAccountingDay = (day: NonAccountingDay) => {
    const dialogTrigger = document.querySelector<HTMLButtonElement>('[data-dialog-trigger="non-accounting"]');
    if (dialogTrigger) {
      dialogTrigger.click();
    }
  };

  const handleExportPDF = () => {
    if (!currentDate || !(currentDate instanceof Date) || isNaN(currentDate.getTime())) {
      toast({
        title: "Erro ao exportar PDF",
        description: "Data inválida para exportação.",
        variant: "destructive",
      });
      return;
    }

    const doc = new jsPDF();
    const monthYear = format(currentDate, 'MMMM yyyy', { locale: ptBR });
    
    // Título
    doc.setFontSize(20);
    doc.text(`Relatório de Horas - ${monthYear}`, 14, 20);
    
    // Resumo
    doc.setFontSize(12);
    doc.text([
      `Dias úteis: ${monthStats.workingDays}`,
      `Horas esperadas: ${monthStats.expectedHours.toFixed(1)}h`,
      `Horas trabalhadas: ${monthStats.workedHours.toFixed(1)}h`,
      `Saldo: ${monthStats.balance.toFixed(1)}h`,
    ], 14, 40);

    // Tabela de turnos
    if (safeData.shifts.length > 0) {
      doc.text('Turnos', 14, 70);
      
      const shiftsData = safeData.shifts.map(shift => [
        format(new Date(shift.date), 'dd/MM/yyyy'),
        shift.start_time.slice(0, 5),
        shift.end_time.slice(0, 5),
        shift.comment || ''
      ]);

      autoTable(doc, {
        startY: 75,
        head: [['Data', 'Início', 'Fim', 'Comentário']],
        body: shiftsData,
      });
    }

    // Tabela de dias não contábeis
    if (safeData.nonAccountingDays.length > 0) {
      const finalY = (doc as any).lastAutoTable.finalY || 75;
      doc.text('Dias Não Contáveis', 14, finalY + 15);
      
      const nonAccountingData = safeData.nonAccountingDays.map(day => [
        format(new Date(day.start_date), 'dd/MM/yyyy'),
        format(new Date(day.end_date), 'dd/MM/yyyy'),
        day.reason
      ]);

      autoTable(doc, {
        startY: finalY + 20,
        head: [['Data Inicial', 'Data Final', 'Motivo']],
        body: nonAccountingData,
      });
    }

    doc.save(`relatorio-${format(currentDate, 'yyyy-MM')}.pdf`);
    
    toast({
      title: "PDF exportado com sucesso!",
      description: "O relatório foi gerado e baixado.",
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-gradient-to-b from-neutral-100 to-neutral-50/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <MonthTitle 
            currentDate={currentDate}
            onExportPDF={handleExportPDF}
          />
          
          <MonthActionButtons 
            onOpenShiftDialog={() => document.querySelector<HTMLButtonElement>('[data-dialog-trigger="shift"]')?.click()}
            onOpenNonAccountingDialog={() => document.querySelector<HTMLButtonElement>('[data-dialog-trigger="non-accounting"]')?.click()}
          />

          <MonthSummary 
            daysInMonth={monthStats.daysInMonth}
            nonAccountingDays={nonAccountingDays}
            workingDays={monthStats.workingDays}
            expectedHours={monthStats.expectedHours}
            workedHours={monthStats.workedHours}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <ShiftsList 
              shifts={safeData.shifts}
              onEdit={handleEditShift}
            />
            <NonAccountingDaysList 
              nonAccountingDays={safeData.nonAccountingDays}
              onEdit={handleEditNonAccountingDay}
            />
          </div>
        </div>
      </div>
      <div className="hidden">
        <ShiftDialog currentDate={currentDate} />
        <NonAccountingDayDialog currentDate={currentDate} />
      </div>
    </div>
  );
};

export default MonthContent;
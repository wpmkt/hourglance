import { format, parseISO } from "date-fns";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "lucide-react";

interface NonAccountingDay {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
}

interface NonAccountingDaysListProps {
  nonAccountingDays: NonAccountingDay[];
}

const NonAccountingDaysList = ({ nonAccountingDays }: NonAccountingDaysListProps) => {
  return (
    <Card className="h-[400px] flex flex-col">
      <div className="p-4 border-b border-neutral-200 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-neutral-500" />
        <h3 className="text-lg font-medium">Dias Não Contábeis</h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {nonAccountingDays?.map((day) => (
            <div 
              key={day.id} 
              className="p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-neutral-900">{day.reason}</p>
                  <p className="text-sm text-neutral-600">
                    {format(parseISO(day.start_date), "dd/MM/yyyy")} -{" "}
                    {format(parseISO(day.end_date), "dd/MM/yyyy")}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {(!nonAccountingDays || nonAccountingDays.length === 0) && (
            <div className="flex flex-col items-center justify-center py-8 text-neutral-500">
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
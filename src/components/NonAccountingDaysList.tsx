import { format, parseISO } from "date-fns";
import { Card } from "@/components/ui/card";

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
    <Card>
      <div className="p-6 border-b border-neutral-200">
        <h3 className="text-lg font-medium">Dias Não Contábeis</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {nonAccountingDays?.map((day) => (
            <div key={day.id} className="p-4 bg-neutral-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{day.reason}</p>
                  <p className="text-sm text-neutral-500">
                    {format(parseISO(day.start_date), "dd/MM/yyyy")} -{" "}
                    {format(parseISO(day.end_date), "dd/MM/yyyy")}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {(!nonAccountingDays || nonAccountingDays.length === 0) && (
            <p className="text-neutral-500 text-center">
              Nenhum dia não contábil registrado
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default NonAccountingDaysList;
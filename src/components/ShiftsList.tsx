import { format, parseISO } from "date-fns";
import { Card } from "@/components/ui/card";

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
  const calculateHours = (start: string, end: string) => {
    const startDate = new Date(`1970-01-01T${start}`);
    const endDate = new Date(`1970-01-01T${end}`);
    return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
  };

  return (
    <Card>
      <div className="p-6 border-b border-neutral-200">
        <h3 className="text-lg font-medium">Turnos Registrados</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {shifts?.map((shift) => (
            <div key={shift.id} className="p-4 bg-neutral-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {format(parseISO(shift.date), "dd/MM/yyyy")}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}
                  </p>
                  {shift.comment && (
                    <p className="text-sm text-neutral-500 mt-1">{shift.comment}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {calculateHours(shift.start_time, shift.end_time).toFixed(1)}h
                    trabalhadas
                  </p>
                </div>
              </div>
            </div>
          ))}
          {(!shifts || shifts.length === 0) && (
            <p className="text-neutral-500 text-center">
              Nenhum turno registrado
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ShiftsList;
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { ShiftDialog } from "@/components/ShiftDialog";
import { NonAccountingDayDialog } from "@/components/NonAccountingDayDialog";
import Layout from "@/components/Layout";
import { useToast } from "@/components/ui/use-toast";

const Month = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentDate = id ? parseISO(id) : new Date();

  const fetchShifts = async () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);

    const { data: shifts, error: shiftsError } = await supabase
      .from("shifts")
      .select("*")
      .gte("date", start.toISOString())
      .lte("date", end.toISOString())
      .order("date", { ascending: true });

    if (shiftsError) throw shiftsError;

    const { data: nonAccountingDays, error: nonAccountingError } = await supabase
      .from("non_accounting_days")
      .select("*")
      .overlaps("start_date", "end_date", start.toISOString(), end.toISOString())
      .order("start_date", { ascending: true });

    if (nonAccountingError) throw nonAccountingError;

    return { shifts, nonAccountingDays };
  };

  const { data, isLoading } = useQuery({
    queryKey: ["month-data", id],
    queryFn: fetchShifts,
  });

  const calculateWorkingDays = () => {
    if (!data) return 0;
    const daysInMonth = endOfMonth(currentDate).getDate();
    const nonAccountingDays = data.nonAccountingDays?.reduce((acc, day) => {
      const start = parseISO(day.start_date);
      const end = parseISO(day.end_date);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return acc + days;
    }, 0) || 0;
    return daysInMonth - nonAccountingDays;
  };

  const calculateWorkedHours = () => {
    if (!data?.shifts) return 0;
    return data.shifts.reduce((acc, shift) => {
      const start = new Date(`1970-01-01T${shift.start_time}`);
      const end = new Date(`1970-01-01T${shift.end_time}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return acc + hours;
    }, 0);
  };

  const calculateExpectedHours = () => {
    const workingDays = calculateWorkingDays();
    return (160 / 30) * workingDays;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    navigate(`/month/${format(newDate, "yyyy-MM-dd")}`);
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Monthly Summary Card */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium text-neutral-500">Dias Previstos</h4>
              <div className="mt-1 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-neutral-500" />
                <span className="text-2xl font-semibold">
                  {endOfMonth(currentDate).getDate()}
                </span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-neutral-500">Dias Não Contábeis</h4>
              <div className="mt-1 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-neutral-500" />
                <span className="text-2xl font-semibold">
                  {data?.nonAccountingDays?.length || 0}
                </span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-neutral-500">Dias a Trabalhar</h4>
              <div className="mt-1 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-neutral-500" />
                <span className="text-2xl font-semibold">{calculateWorkingDays()}</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-neutral-500">Horas Previstas</h4>
              <div className="mt-1 flex items-center gap-2">
                <Clock className="h-4 w-4 text-neutral-500" />
                <span className="text-2xl font-semibold">
                  {calculateExpectedHours().toFixed(1)}
                </span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-neutral-500">Horas Trabalhadas</h4>
              <div className="mt-1 flex items-center gap-2">
                <Clock className="h-4 w-4 text-neutral-500" />
                <span className="text-2xl font-semibold">
                  {calculateWorkedHours().toFixed(1)}
                </span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-neutral-500">Saldo</h4>
              <div className="mt-1 flex items-center gap-2">
                <Clock className="h-4 w-4 text-neutral-500" />
                <span
                  className={`text-2xl font-semibold ${
                    calculateWorkedHours() - calculateExpectedHours() >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {(calculateWorkedHours() - calculateExpectedHours()).toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <ShiftDialog />
          <NonAccountingDayDialog />
        </div>

        {/* Records Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Non-Accounting Days */}
          <Card>
            <div className="p-6 border-b border-neutral-200">
              <h3 className="text-lg font-medium">Dias Não Contábeis</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {data?.nonAccountingDays?.map((day) => (
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
                {(!data?.nonAccountingDays || data.nonAccountingDays.length === 0) && (
                  <p className="text-neutral-500 text-center">
                    Nenhum dia não contábil registrado
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Work Shifts */}
          <Card>
            <div className="p-6 border-b border-neutral-200">
              <h3 className="text-lg font-medium">Turnos Registrados</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {data?.shifts?.map((shift) => (
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
                          {(
                            (new Date(`1970-01-01T${shift.end_time}`).getTime() -
                              new Date(`1970-01-01T${shift.start_time}`).getTime()) /
                            (1000 * 60 * 60)
                          ).toFixed(1)}
                          h trabalhadas
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {(!data?.shifts || data.shifts.length === 0) && (
                  <p className="text-neutral-500 text-center">
                    Nenhum turno registrado
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Month;
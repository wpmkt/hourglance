import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus } from "lucide-react";

const Month = () => {
  const calculateWorkingDays = () => {
    const totalDays = 30; // Example for a 30-day month
    const nonAccountingDays = 2; // Example
    return totalDays - nonAccountingDays;
  };

  const calculateExpectedHours = () => {
    const workingDays = calculateWorkingDays();
    return (160 / 30) * workingDays;
  };

  return (
    <div className="space-y-6">
      {/* Monthly Summary Card */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="text-sm font-medium text-neutral-500">Dias Previstos</h4>
            <div className="mt-1 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-neutral-500" />
              <span className="text-2xl font-semibold">30</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-neutral-500">Dias Não Contábeis</h4>
            <div className="mt-1 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-neutral-500" />
              <span className="text-2xl font-semibold">2</span>
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
              <span className="text-2xl font-semibold">120.0</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-neutral-500">Saldo</h4>
            <div className="mt-1 flex items-center gap-2">
              <Clock className="h-4 w-4 text-neutral-500" />
              <span className="text-2xl font-semibold text-red-500">-40.0</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button>
          <Plus className="w-4 h-4" />
          Lançar Turno
        </Button>
        <Button variant="outline">
          <Plus className="w-4 h-4" />
          Lançar Dia Não Contábil
        </Button>
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
              <div className="p-4 bg-neutral-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Férias</p>
                    <p className="text-sm text-neutral-500">01/03/2024 - 15/03/2024</p>
                  </div>
                </div>
              </div>
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
              <div className="p-4 bg-neutral-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">16/03/2024</p>
                    <p className="text-sm text-neutral-500">08:00 - 17:00</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">8h trabalhadas</p>
                    <p className="text-sm text-neutral-500">0h noturnas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Month;
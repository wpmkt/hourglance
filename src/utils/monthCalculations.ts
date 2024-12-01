import { calculateTotalHours } from "./timeCalculations";
import type { Database } from "@/integrations/supabase/types";

type Shift = Database["public"]["Tables"]["shifts"]["Row"];

export const calculateMonthStats = (
  currentDate: Date,
  shifts: Shift[],
  nonAccountingDays: number
) => {
  // Total de dias no mês
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  // Dias a trabalhar = Dias do mês - Dias não contábeis
  const workingDays = Math.max(0, daysInMonth - nonAccountingDays);
  
  // Horas previstas = (160 / Dias do mês) × Dias a trabalhar
  const expectedHours = (160 / daysInMonth) * workingDays;

  // Horas trabalhadas = Soma das horas de cada turno (incluindo adicional noturno)
  const workedHours = shifts.reduce((acc, shift) => {
    const shiftHours = calculateTotalHours(shift.start_time, shift.end_time);
    return acc + shiftHours;
  }, 0);

  // Saldo = Horas trabalhadas - Horas previstas
  const balance = workedHours - expectedHours;

  return {
    daysInMonth,
    workingDays,
    expectedHours,
    workedHours,
    balance
  };
};
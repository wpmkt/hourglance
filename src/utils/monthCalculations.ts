import { calculateNightMinutes, calculateTotalHours } from "./timeCalculations";
import type { Database } from "@/integrations/supabase/types";

type Shift = Database["public"]["Tables"]["shifts"]["Row"];

export const calculateMonthStats = (
  currentDate: Date,
  shifts: Shift[],
  nonAccountingDays: number
) => {
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const workingDays = daysInMonth - nonAccountingDays;
  const expectedHours = (160 / daysInMonth) * workingDays;

  const workedHours = shifts.reduce((acc, shift) => {
    return acc + calculateTotalHours(shift.start_time, shift.end_time);
  }, 0);

  return {
    daysInMonth,
    workingDays,
    expectedHours,
    workedHours,
    balance: workedHours - expectedHours
  };
};
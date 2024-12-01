import { endOfMonth, differenceInDays, addDays } from "date-fns";

export const calculateWorkingDays = (
  currentDate: Date,
  nonAccountingDays: number
) => {
  const daysInMonth = endOfMonth(currentDate).getDate();
  return daysInMonth - nonAccountingDays;
};

export const calculateExpectedHours = (
  currentDate: Date,
  workingDays: number
) => {
  const daysInMonth = endOfMonth(currentDate).getDate();
  return (160 / daysInMonth) * workingDays;
};

export const calculateNightMinutes = (start: string, end: string) => {
  const startDate = new Date(`1970-01-01T${start}`);
  let endDate = new Date(`1970-01-01T${end}`);
  
  if (endDate < startDate) {
    endDate = addDays(endDate, 1);
  }

  const nightStartHour = 22;
  const nightEndHour = 5;
  let nightMinutes = 0;
  let currentDate = new Date(startDate);

  while (currentDate < endDate) {
    const hour = currentDate.getHours();
    if (hour >= nightStartHour || hour < nightEndHour) {
      nightMinutes += 10;
    }
    currentDate.setTime(currentDate.getTime() + 3600000); // Add 1 hour
  }

  return nightMinutes;
};

export const calculateTotalHours = (start: string, end: string) => {
  const startDate = new Date(`1970-01-01T${start}`);
  let endDate = new Date(`1970-01-01T${end}`);
  
  if (endDate < startDate) {
    endDate = addDays(endDate, 1);
  }

  const baseHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
  const nightMinutes = calculateNightMinutes(start, end);
  const additionalHours = nightMinutes / 60;

  return baseHours + additionalHours;
};

export const calculateQuarterStats = (
  shifts: any[],
  nonAccountingDays: any[],
  startMonth: number,
  year: number
) => {
  let totalWorkedHours = 0;
  let totalPlannedHours = 0;

  for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
    const currentMonth = startMonth + monthOffset;
    const date = new Date(year, currentMonth, 1);
    const daysInMonth = endOfMonth(date).getDate();
    
    const monthShifts = shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return shiftDate.getMonth() === currentMonth && shiftDate.getFullYear() === year;
    });

    const monthNonAccountingDays = nonAccountingDays.filter(day => {
      const startDate = new Date(day.start_date);
      const endDate = new Date(day.end_date);
      return (
        (startDate.getMonth() === currentMonth && startDate.getFullYear() === year) ||
        (endDate.getMonth() === currentMonth && endDate.getFullYear() === year)
      );
    });

    const nonAccountingDaysCount = monthNonAccountingDays.reduce((acc, day) => {
      const start = new Date(day.start_date);
      const end = new Date(day.end_date);
      return acc + differenceInDays(end, start) + 1;
    }, 0);

    const workingDays = calculateWorkingDays(date, nonAccountingDaysCount);
    totalPlannedHours += calculateExpectedHours(date, workingDays);

    monthShifts.forEach(shift => {
      totalWorkedHours += calculateTotalHours(shift.start_time, shift.end_time);
    });
  }

  return {
    planned: Math.round(totalPlannedHours * 10) / 10,
    worked: Math.round(totalWorkedHours * 10) / 10,
    balance: Math.round((totalWorkedHours - totalPlannedHours) * 10) / 10
  };
};
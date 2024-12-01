export const calculateNightMinutes = (start: string, end: string) => {
  const startDate = new Date(`1970-01-01T${start}`);
  let endDate = new Date(`1970-01-01T${end}`);
  
  if (endDate < startDate) {
    endDate.setDate(endDate.getDate() + 1);
  }

  const nightStartHour = 23;
  const nightEndHour = 5;

  let nightMinutes = 0;
  let currentHour = startDate.getHours();
  let currentDate = new Date(startDate);

  while (currentDate < endDate) {
    if (currentHour >= nightStartHour || currentHour < nightEndHour) {
      nightMinutes += 10;
    }
    currentDate.setTime(currentDate.getTime() + 3600000);
    currentHour = currentDate.getHours();
  }

  return nightMinutes;
};

export const calculateTotalHours = (start: string, end: string) => {
  const startDate = new Date(`1970-01-01T${start}`);
  let endDate = new Date(`1970-01-01T${end}`);
  
  if (endDate < startDate) {
    endDate.setDate(endDate.getDate() + 1);
  }

  const baseHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
  const nightMinutes = calculateNightMinutes(start, end);
  const additionalHours = nightMinutes / 60;

  return baseHours + additionalHours;
};
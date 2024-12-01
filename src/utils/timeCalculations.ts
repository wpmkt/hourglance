export const calculateNightMinutes = (start: string, end: string) => {
  const startDate = new Date(`1970-01-01T${start}`);
  let endDate = new Date(`1970-01-01T${end}`);
  
  // If end time is before start time, it means the shift goes into the next day
  if (endDate < startDate) {
    endDate.setDate(endDate.getDate() + 1);
  }

  const nightStartHour = 22; // 22:00
  const nightEndHour = 5;    // 05:00
  let nightMinutes = 0;
  let currentTime = new Date(startDate);

  while (currentTime < endDate) {
    const currentHour = currentTime.getHours();
    if (currentHour >= nightStartHour || currentHour < nightEndHour) {
      nightMinutes++;
    }
    currentTime.setMinutes(currentTime.getMinutes() + 1);
  }

  // For every complete hour during night shift, add 10 minutes
  return Math.floor(nightMinutes / 60) * 10;
};

export const calculateTotalHours = (start: string, end: string) => {
  const startDate = new Date(`1970-01-01T${start}`);
  let endDate = new Date(`1970-01-01T${end}`);
  
  // If end time is before start time, it means the shift goes into the next day
  if (endDate < startDate) {
    endDate.setDate(endDate.getDate() + 1);
  }

  // Calculate base duration in milliseconds
  const durationMs = endDate.getTime() - startDate.getTime();
  
  // Convert to hours
  const baseHours = durationMs / (1000 * 60 * 60);
  
  // Calculate night shift bonus (in hours)
  const nightMinutes = calculateNightMinutes(start, end);
  const nightHoursBonus = nightMinutes / 60;

  return baseHours + nightHoursBonus;
};
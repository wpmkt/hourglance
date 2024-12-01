export const calculateNightMinutes = (start: string, end: string) => {
  const startDate = new Date(`1970-01-01T${start}`);
  let endDate = new Date(`1970-01-01T${end}`);
  
  // Se o horário final for menor que o inicial, significa que passou para o próximo dia
  if (endDate < startDate) {
    endDate.setDate(endDate.getDate() + 1);
  }

  const nightStartHour = 23; // 23:00
  const nightEndHour = 5;    // 05:00
  let nightMinutes = 0;
  let currentTime = new Date(startDate);

  // Itera minuto a minuto para calcular o tempo noturno
  while (currentTime < endDate) {
    const hour = currentTime.getHours();
    // Se estiver entre 23h e 5h, conta como hora noturna
    if (hour >= nightStartHour || hour < nightEndHour) {
      nightMinutes++;
    }
    currentTime.setMinutes(currentTime.getMinutes() + 1);
  }

  // Para cada hora noturna completa, adiciona 10 minutos
  return Math.floor(nightMinutes / 60) * 10;
};

export const calculateTotalHours = (start: string, end: string) => {
  const startDate = new Date(`1970-01-01T${start}`);
  let endDate = new Date(`1970-01-01T${end}`);
  
  // Se o horário final for menor que o inicial, significa que passou para o próximo dia
  if (endDate < startDate) {
    endDate.setDate(endDate.getDate() + 1);
  }

  // Calcula a duração base em milissegundos
  const durationMs = endDate.getTime() - startDate.getTime();
  
  // Converte para horas
  const baseHours = durationMs / (1000 * 60 * 60);
  
  // Calcula o adicional noturno (em horas)
  const nightMinutes = calculateNightMinutes(start, end);
  const nightHoursBonus = nightMinutes / 60;

  return baseHours + nightHoursBonus;
};
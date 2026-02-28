import { addDays, format } from 'date-fns';

export const formatWeekRange = (weekStart: Date): string => {
  const weekEnd = addDays(weekStart, 6);
  const startYear = weekStart.getFullYear();
  const endYear = weekEnd.getFullYear();

  if (startYear !== endYear) {
    return `${format(weekStart, 'MMM d, yyyy')} - ${format(weekEnd, 'MMM d, yyyy')}`;
  }

  if (weekStart.getMonth() !== weekEnd.getMonth()) {
    return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
  }

  return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'd, yyyy')}`;
};

import { addDays, startOfWeek, subDays } from 'date-fns';
import { create } from 'zustand';

import { ViewMode } from '@event-management/shared';

interface CalendarState {
  currentMonth: number;
  currentYear: number;
  viewMode: ViewMode;
  selectedWeekStart: Date | null;

  setMonth: (month: number, year: number) => void;
  nextMonth: () => void;
  prevMonth: () => void;
  nextWeek: () => void;
  prevWeek: () => void;
  setViewMode: (mode: ViewMode) => void;
  setSelectedWeekStart: (date: Date) => void;
}

export const useCalendarStore = create<CalendarState>((set, get) => {
  const now = new Date();

  return {
    currentMonth: now.getMonth() + 1,
    currentYear: now.getFullYear(),
    viewMode: ViewMode.MONTH,
    selectedWeekStart: null,

    setMonth: (month: number, year: number): void => {
      set({ currentMonth: month, currentYear: year });
    },

    nextMonth: (): void => {
      const { currentMonth, currentYear } = get();

      if (currentMonth === 12) {
        set({ currentMonth: 1, currentYear: currentYear + 1 });
      } else {
        set({ currentMonth: currentMonth + 1 });
      }
    },

    prevMonth: (): void => {
      const { currentMonth, currentYear } = get();

      if (currentMonth === 1) {
        set({ currentMonth: 12, currentYear: currentYear - 1 });
      } else {
        set({ currentMonth: currentMonth - 1 });
      }
    },

    nextWeek: (): void => {
      const { selectedWeekStart } = get();
      const current = selectedWeekStart ?? startOfWeek(new Date());
      const newWeekStart = addDays(current, 7);

      set({
        selectedWeekStart: newWeekStart,
        currentMonth: newWeekStart.getMonth() + 1,
        currentYear: newWeekStart.getFullYear(),
      });
    },

    prevWeek: (): void => {
      const { selectedWeekStart } = get();
      const current = selectedWeekStart ?? startOfWeek(new Date());
      const newWeekStart = subDays(current, 7);

      set({
        selectedWeekStart: newWeekStart,
        currentMonth: newWeekStart.getMonth() + 1,
        currentYear: newWeekStart.getFullYear(),
      });
    },

    setViewMode: (mode: ViewMode): void => {
      set({ viewMode: mode });
    },

    setSelectedWeekStart: (date: Date): void => {
      set({ selectedWeekStart: date });
    },
  };
});

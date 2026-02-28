import { create } from 'zustand';

interface EventsState {
  search: string;
  startPage: number;

  setSearch: (search: string) => void;
  setStartPage: (page: number) => void;
}

export const useEventsStore = create<EventsState>((set) => ({
  search: '',
  startPage: 1,

  setSearch: (search: string): void => {
    set({ search, startPage: 1 });
  },

  setStartPage: (page: number): void => {
    set({ startPage: page });
  },
}));

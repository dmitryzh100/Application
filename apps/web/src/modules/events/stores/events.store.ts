import { create } from 'zustand';

interface EventsState {
  search: string;
  startPage: number;
  selectedTagIds: string[];

  setSearch: (search: string) => void;
  setStartPage: (page: number) => void;
  setSelectedTagIds: (tagIds: string[]) => void;
}

export const useEventsStore = create<EventsState>((set) => ({
  search: '',
  startPage: 1,
  selectedTagIds: [],

  setSearch: (search: string): void => {
    set({ search, startPage: 1 });
  },

  setStartPage: (page: number): void => {
    set({ startPage: page });
  },

  setSelectedTagIds: (selectedTagIds: string[]): void => {
    set({ selectedTagIds, startPage: 1 });
  },
}));

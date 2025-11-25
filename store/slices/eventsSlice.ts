import { Event } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EventsState {
  items: Event[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

const initialState: EventsState = {
  items: [],
  loading: false,
  error: null,
  lastFetch: null,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEventsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setEventsSuccess: (state, action: PayloadAction<Event[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
      state.lastFetch = Date.now();
    },
    setEventsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setEventsLoading, setEventsSuccess, setEventsError } = eventsSlice.actions;
export default eventsSlice.reducer;

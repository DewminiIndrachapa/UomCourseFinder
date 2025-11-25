import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SavedItem {
  id: string;
  type: 'course' | 'event';
  savedAt: number;
}

interface FavoritesState {
  items: SavedItem[];
}

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<{ id: string; type: 'course' | 'event' }>) => {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (!exists) {
        state.items.push({
          ...action.payload,
          savedAt: Date.now(),
        });
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearFavorites: (state) => {
      state.items = [];
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;

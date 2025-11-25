import { Course } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CoursesState {
  items: Course[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

const initialState: CoursesState = {
  items: [],
  loading: false,
  error: null,
  lastFetch: null,
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setCoursesLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCoursesSuccess: (state, action: PayloadAction<Course[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
      state.lastFetch = Date.now();
    },
    setCoursesError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setCoursesLoading, setCoursesSuccess, setCoursesError } = coursesSlice.actions;
export default coursesSlice.reducer;

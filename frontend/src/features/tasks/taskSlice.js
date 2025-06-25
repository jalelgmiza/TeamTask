import { createSlice } from '@reduxjs/toolkit';

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    selectedStatus: 'all',
    error: null,
  },
  reducers: {
    setSelectedStatus: (state, action) => {
      state.selectedStatus = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setSelectedStatus, clearError } = taskSlice.actions;
export default taskSlice.reducer;
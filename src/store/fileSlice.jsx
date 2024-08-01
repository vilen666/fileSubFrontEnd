import { createSlice } from '@reduxjs/toolkit';
const fileSlice = createSlice({
  name: 'files',
  initialState: {
    value: [],
  },
  reducers: {
    setfile: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setfile } = fileSlice.actions;
export default fileSlice.reducer;

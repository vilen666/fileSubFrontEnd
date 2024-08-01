import { createSlice } from '@reduxjs/toolkit';
const userSlice = createSlice({
  name: 'user',
  initialState: {
    value: {name:"XXXX",email:"XXXX"},
  },
  reducers: {
    setuser: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setuser } = userSlice.actions;
export default userSlice.reducer;

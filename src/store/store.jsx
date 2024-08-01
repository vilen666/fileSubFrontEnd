
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import fileReducer from './fileSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    files:fileReducer
  },
});

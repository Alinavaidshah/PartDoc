import { configureStore } from '@reduxjs/toolkit';
import partsReducer from '../features/parts/partsSlice';
import appointmentReducer from '../features/appointment/appointmentSlice';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';

export const store = configureStore({
  reducer: {
    parts: partsReducer,
    appointment: appointmentReducer,
    auth: authReducer,
    cart: cartReducer,
  },
});
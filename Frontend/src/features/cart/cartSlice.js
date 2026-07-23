import { createSlice } from '@reduxjs/toolkit';

// 1. Initial State: App load hote waqt LocalStorage se data uthao (agar hai, warna empty array)
const savedCart = JSON.parse(localStorage.getItem('cartItems')) || [];

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: savedCart },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(item => item._id === action.payload._id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      // 2. Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      // 2. Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(item => item._id === action.payload.id);
      if (item) {
        item.quantity = action.payload.qty;
      }
      // 2. Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    // 3. New Reducer: Cart saaf karne ke liye
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cartItems');
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
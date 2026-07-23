import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig'; 


const getAdminInfo = () => {
  try {
    const data = localStorage.getItem('adminInfo');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

// Async Thunk for Login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Ab hum raw axios ki jagah custom 'api' instance use kar rahe hain
      const response = await api.post('/auth/login', credentials);
      
      // Response save karna
      localStorage.setItem('adminInfo', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userInfo: getAdminInfo(),
    isAdmin: getAdminInfo() ? getAdminInfo().isAdmin : false,
    loading: false,
    error: null
  },
  reducers: {
    logoutAdmin: (state) => {
      localStorage.removeItem('adminInfo');
      state.userInfo = null;
      state.isAdmin = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.isAdmin = action.payload.isAdmin;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logoutAdmin } = authSlice.actions;
export default authSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

// Async thunk to fetch parts (category optional hai)
export const fetchParts = createAsyncThunk('parts/fetchParts', async (category = '', thunkAPI) => {
  try {
    // baseURL pehle se '/api' par set hai, isliye yahan sirf '/parts' use hoga
    const url = category ? `/parts?category=${category}` : '/parts';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch parts');
  }
});

const partsSlice = createSlice({
  name: 'parts',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetParts: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchParts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetParts } = partsSlice.actions;
export default partsSlice.reducer;
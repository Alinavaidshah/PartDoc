import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { API_URL as BASE_API_URL } from '../../api/axiosConfig';

// Backend API URL
const API_URL = `${BASE_API_URL}/api/parts`;

// Async thunk to fetch parts (category optional hai)
export const fetchParts = createAsyncThunk('parts/fetchParts', async (category = '', thunkAPI) => {
  try {
    // Agar category pass hogi toh URL banega: /api/parts?category=mobile
    // Warna ye simple fetch karega
    const url = category ? `${API_URL}?category=${category}` : API_URL;
    const response = await axios.get(url);
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
    // Agar kabhi state reset karni ho toh yahan add kar sakte ho
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
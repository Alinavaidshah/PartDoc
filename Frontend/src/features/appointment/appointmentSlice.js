import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL as BASE_API_URL } from '../../api/axiosConfig';

const API_URL = `${BASE_API_URL}/api/appointments`;

// 1. Async Thunk: Appointment Book karne ke liye
export const bookAppointment = createAsyncThunk(
  'appointment/bookAppointment',
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(API_URL, formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Server connection failed.'
      );
    }
  }
);

// 2. Async Thunk: Status Check karne ke liye
export const checkAppointmentStatus = createAsyncThunk(
  'appointment/checkAppointmentStatus',
  async ({ appointmentId, name }, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/${appointmentId}?name=${name}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'No record found with these credentials.'
      );
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState: {
    // Booking Form State
    bookingLoading: false,
    bookingSuccess: false,
    bookingData: null,
    bookingError: '',

    // Status Query State
    statusLoading: false,
    statusData: null,
    statusError: '',
  },
  reducers: {
    resetBookingState: (state) => {
      state.bookingLoading = false;
      state.bookingSuccess = false;
      state.bookingData = null;
      state.bookingError = '';
    },
    resetStatusQuery: (state) => {
      state.statusLoading = false;
      state.statusData = null;
      state.statusError = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // BOOK APPOINTMENT CASES
      .addCase(bookAppointment.pending, (state) => {
        state.bookingLoading = true;
        state.bookingError = '';
        state.bookingSuccess = false;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.bookingLoading = false;
        state.bookingSuccess = true;
        state.bookingData = action.payload;
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.bookingLoading = false;
        state.bookingSuccess = false;
        state.bookingError = action.payload;
      })

      // CHECK STATUS CASES
      .addCase(checkAppointmentStatus.pending, (state) => {
        state.statusLoading = true;
        state.statusError = '';
        state.statusData = null;
      })
      .addCase(checkAppointmentStatus.fulfilled, (state, action) => {
        state.statusLoading = false;
        state.statusData = action.payload;
      })
      .addCase(checkAppointmentStatus.rejected, (state, action) => {
        state.statusLoading = false;
        state.statusData = null;
        state.statusError = action.payload;
      });
  },
});

export const { resetBookingState, resetStatusQuery } = appointmentSlice.actions;
export default appointmentSlice.reducer;
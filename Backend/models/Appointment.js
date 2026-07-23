import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    customerEmail: { // <-- Yeh naya field add kiya hai email notification ke liye
      type: String,
      required: true,
      trim: true,
    },
    deviceModel: {
      type: String,
      required: true,
    },
    issueDescription: {
      type: String,
      required: true,
    },
    appointmentDate: {
      type: String,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
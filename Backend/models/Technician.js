import mongoose from 'mongoose';

const technicianSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    specialization: {
      type: String,
      required: true,
      default: 'Mobile OLED & Screen Repair',
    },
    experience: {
      type: String,
      required: true,
      default: '2-3 Years',
    },
    status: {
      type: String,
      enum: ['Pending', 'Contacted', 'Hired', 'Rejected'],
      default: 'Pending',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Technician = mongoose.model('Technician', technicianSchema, 'Technicians');
export default Technician;

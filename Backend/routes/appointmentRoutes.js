import express from 'express';
import { 
  createAppointment, 
  getAppointments, 
  updateAppointmentStatus,
  getAppointmentStatus,
  deleteAppointment,
  getDashboardStats 
} from '../controllers/appointmentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js'; // Tumhara naya file
import { appointmentSchema } from '../middleware/validationSchemas.js'; //

const router = express.Router();
router.post('/book', validate(appointmentSchema), createAppointment);

// 1. Stats sirf admin dekh sake (Protected)
router.route('/stats').get(protect, admin, getDashboardStats);

// 2. Appointment create karna PUBLIC hai (No middleware)
// 3. Appointments list dekhna ADMIN ke liye (Protected)
router.route('/')
  .post(createAppointment) // Ye public hai, koi bhi appointment book kar sakta hai
  .get(protect, admin, getAppointments); // Ye sirf admin dekh sakta hai

// 4. Single appointment status check (Public/User)
router.route('/:id').get(getAppointmentStatus);

// 5. Status update aur delete sirf ADMIN (Protected)
router.route('/:id/status').put(protect, admin, updateAppointmentStatus);
router.route('/:id').delete(protect, admin, deleteAppointment); 

export default router;
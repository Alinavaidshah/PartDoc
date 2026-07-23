import Appointment from '../models/Appointment.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Create new appointment (Customer)
// @route   POST /api/appointments
export const createAppointment = async (req, res) => {
  try {
    const { name, phone, deviceModel, issueDescription, appointmentDate, appointmentTime, customerEmail } = req.body;

    const appointment = new Appointment({
      name,
      phone,
      deviceModel,
      issueDescription,
      appointmentDate,
      appointmentTime,
      customerEmail,
    });

    const createdAppointment = await appointment.save();
    res.status(201).json(createdAppointment);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data: ' + error.message });
  }
};

// @desc    Get all appointments (Admin)
// @route   GET /api/appointments
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({}).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Get dashboard stats (Naya function)
// @route   GET /api/appointments/stats
export const getDashboardStats = async (req, res) => {
  try {
    const appointments = await Appointment.find({}).sort({ createdAt: -1 });
    const pending = appointments.filter(a => a.status === 'Pending');
    res.json({ appointments, pendingCount: pending.length });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// appointmentController.js
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    await Appointment.findByIdAndDelete(id); // Apna model name check kar lena (e.g., Appointment)
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete operation failed" });
  }
};

// @desc    Update appointment status (Admin - Approved/Denied)
// @route   PUT /api/appointments/:id/status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body; 
    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
      appointment.status = status || appointment.status;
      const updatedAppointment = await appointment.save();

      // Email notification logic
      if (appointment.customerEmail) {
        let subject = '';
        let message = '';

        if (status === 'Approved') {
          subject = 'Appointment Approved! - PartDoc';
          message = `Dear ${appointment.name},\n\nYour appointment request for your ${appointment.deviceModel} on ${appointment.appointmentDate} at ${appointment.appointmentTime} has been APPROVED.\n\nThank you for choosing us!\n\nBest regards,\nPartDoc Team`;
        } else if (status === 'Denied') {
          subject = 'Appointment Update - PartDoc';
          message = `Dear ${appointment.name},\n\nWe regret to inform you that your appointment request for ${appointment.deviceModel} on ${appointment.appointmentDate} has been denied due to slot unavailability.\n\nPlease request another time slot.\n\nBest regards,\nPartDoc Team`;
        }

        if (subject && message) {
          try {
            await sendEmail({
              email: appointment.customerEmail,
              subject: subject,
              message: message,
            });
            console.log(`🚀 Notification email sent successfully to ${appointment.customerEmail}`);
          } catch (emailError) {
            console.error('❌ Email send fail :', emailError.message);
          }
        }
      }

      res.json(updatedAppointment);
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Get single appointment status by ID
// @route   GET /api/appointments/:id
export const getAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.query; 

    const appointment = await Appointment.findById(id);

    if (!appointment || appointment.name.toLowerCase() !== name.toLowerCase()) {
      return res.status(404).json({ 
        message: 'No matching appointment ticket found with these credentials.' 
      });
    }

    res.status(200).json(appointment);
    
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Tracking ID format.' });
    }
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};
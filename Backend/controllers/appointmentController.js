import Appointment from '../models/Appointment.js';
import Settings from '../models/Settings.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Create new appointment (Customer)
// @route   POST /api/appointments
export const createAppointment = async (req, res) => {
  try {
    const {
      name,
      phone,
      deviceModel,
      issueDescription,
      appointmentDate,
      appointmentTime,
      customerEmail,
      serviceType,
      price,
      address,
    } = req.body;

    let finalPrice = Number(price) || 0;

    // If Fault Tracing service selected, ensure accurate price from settings if not specified
    if (serviceType === 'Fault Tracing' && (!price || price <= 0)) {
      const priceSetting = await Settings.findOne({ key: 'faultTracingPrice' });
      finalPrice = priceSetting ? Number(priceSetting.value) : 899;
    }

    const appointment = new Appointment({
      name,
      phone,
      deviceModel,
      issueDescription: issueDescription || (serviceType === 'Fault Tracing' ? 'Fault Tracing Of Your Device At Your Door Step' : 'Hardware Diagnostic'),
      appointmentDate,
      appointmentTime,
      customerEmail,
      serviceType: serviceType || 'Normal',
      price: finalPrice,
      address: address || '',
    });

    const createdAppointment = await appointment.save();

    // Optionally send initial confirmation email to customer
    if (customerEmail) {
      try {
        const isFaultTracing = serviceType === 'Fault Tracing';
        const serviceName = isFaultTracing ? 'Fault Tracing Of Your Device At Your Door Step' : 'Standard Diagnostic Appointment';
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #4f46e5;">Appointment Request Received</h2>
            <p>Dear <b>${name}</b>,</p>
            <p>Your repair appointment request has been successfully submitted and is currently <b>Pending Confirmation</b>.</p>

            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; rounded-radius: 8px; margin: 15px 0;">
              <p style="margin: 4px 0;"><b>Ticket Reference ID:</b> ${createdAppointment._id}</p>
              <p style="margin: 4px 0;"><b>Service:</b> ${serviceName}</p>
              <p style="margin: 4px 0;"><b>Device Model:</b> ${deviceModel}</p>
              <p style="margin: 4px 0;"><b>Date & Time:</b> ${appointmentDate} at ${appointmentTime}</p>
              ${isFaultTracing ? `<p style="margin: 4px 0;"><b>Fixed Inspection Price:</b> Rs ${finalPrice}</p>` : ''}
              ${address ? `<p style="margin: 4px 0;"><b>Complete Address:</b> ${address}</p>` : ''}
            </div>

            <p>Our team will review your slot request and update you shortly.</p>
            <p style="font-weight: bold; color: #4f46e5;">Our team will contact you soon.</p>
          </div>
        `;

        await sendEmail({
          email: customerEmail,
          subject: 'Appointment Request Received - PartDoc',
          html: emailHtml,
        });
      } catch (emailErr) {
        console.error('❌ Initial appointment email failed:', emailErr.message);
      }
    }

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

// @desc    Get dashboard stats (Admin)
// @route   GET /api/appointments/stats
export const getDashboardStats = async (req, res) => {
  try {
    const appointments = await Appointment.find({}).sort({ createdAt: -1 });
    const pending = appointments.filter((a) => a.status === 'Pending');
    res.json({ appointments, pendingCount: pending.length });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Delete appointment (Admin)
// @route   DELETE /api/appointments/:id
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    await Appointment.findByIdAndDelete(id);
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete operation failed' });
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

      // Email notification logic in complete English
      if (appointment.customerEmail) {
        let subject = '';
        let messageHtml = '';
        const isFaultTracing = appointment.serviceType === 'Fault Tracing';

        if (status === 'Approved') {
          subject = 'Appointment Approved! - PartDoc';
          messageHtml = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #16a34a;">Appointment Confirmed & Approved</h2>
              <p>Dear <b>${appointment.name}</b>,</p>
              <p>Your appointment request for <b>${appointment.deviceModel}</b> on <b>${appointment.appointmentDate}</b> at <b>${appointment.appointmentTime}</b> has been <b>APPROVED</b>.</p>
              ${isFaultTracing ? `<p><b>Service Type:</b> Doorstep Fault Tracing (Rs ${appointment.price})</p>` : ''}
              ${appointment.address ? `<p><b>Doorstep Address:</b> ${appointment.address}</p>` : ''}
              <p>Thank you for choosing PartDoc!</p>
              <p style="font-weight: bold; color: #4f46e5; margin-top: 20px;">Our team will contact you soon.</p>
            </div>
          `;
        } else if (status === 'Denied') {
          subject = 'Appointment Status Update - PartDoc';
          messageHtml = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #dc2626;">Appointment Request Update</h2>
              <p>Dear <b>${appointment.name}</b>,</p>
              <p>We regret to inform you that your appointment request for <b>${appointment.deviceModel}</b> on <b>${appointment.appointmentDate}</b> could not be approved at this time due to schedule or slot unavailability.</p>
              <p>Please feel free to submit another time slot through our portal.</p>
              <p style="font-weight: bold; color: #4f46e5; margin-top: 20px;">Our team will contact you soon.</p>
            </div>
          `;
        }

        if (subject && messageHtml) {
          try {
            await sendEmail({
              email: appointment.customerEmail,
              subject: subject,
              html: messageHtml,
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
        message: 'No matching appointment ticket found with these credentials.',
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

// @desc    Get Fault Tracing Price & Settings (Public / Customer / Admin)
// @route   GET /api/appointments/settings
export const getAppointmentSettings = async (req, res) => {
  try {
    const priceSetting = await Settings.findOne({ key: 'faultTracingPrice' });
    const faultTracingPrice = priceSetting ? Number(priceSetting.value) : 899;
    res.json({ faultTracingPrice });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Update Fault Tracing Price (Admin)
// @route   PUT /api/appointments/settings
export const updateAppointmentSettings = async (req, res) => {
  try {
    const { faultTracingPrice } = req.body;
    if (faultTracingPrice === undefined || isNaN(Number(faultTracingPrice))) {
      return res.status(400).json({ message: 'Invalid price value' });
    }

    let priceSetting = await Settings.findOne({ key: 'faultTracingPrice' });
    if (priceSetting) {
      priceSetting.value = Number(faultTracingPrice);
      await priceSetting.save();
    } else {
      priceSetting = await Settings.create({
        key: 'faultTracingPrice',
        value: Number(faultTracingPrice),
      });
    }

    res.json({ message: 'Price updated successfully', faultTracingPrice: priceSetting.value });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};
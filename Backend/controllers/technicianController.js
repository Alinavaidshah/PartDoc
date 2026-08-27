import Technician from '../models/Technician.js';

// @desc    Submit Technician Application (Public)
// @route   POST /api/technicians/apply
export const applyTechnician = async (req, res) => {
  try {
    const { name, phone, specialization, experience } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and Phone number are required.' });
    }

    const application = await Technician.create({
      name,
      phone,
      specialization: specialization || 'Mobile OLED & Screen Repair',
      experience: experience || '1-2 Years',
      status: 'Pending',
    });

    res.status(201).json({
      message: 'Application submitted successfully!',
      application,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Get All Technician Applications (Admin)
// @route   GET /api/technicians
export const getTechnicians = async (req, res) => {
  try {
    const technicians = await Technician.find().sort({ createdAt: -1 });
    res.json(technicians);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Update Technician Application Status (Admin)
// @route   PUT /api/technicians/:id
export const updateTechnicianStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const technician = await Technician.findById(req.params.id);

    if (!technician) {
      return res.status(404).json({ message: 'Technician application not found.' });
    }

    if (status) technician.status = status;
    if (notes !== undefined) technician.notes = notes;

    const updated = await technician.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Delete Technician Application (Admin)
// @route   DELETE /api/technicians/:id
export const deleteTechnician = async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id);
    if (!technician) {
      return res.status(404).json({ message: 'Application not found.' });
    }
    await technician.deleteOne();
    res.json({ message: 'Application removed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

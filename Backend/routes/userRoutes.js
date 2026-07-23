import express from 'express';
import User from '../models/User.js'; // Path check kar lena

const router = express.Router();

// @desc    Get all users (Admin use only)
// @route   GET /api/users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}); // Sabhi users nikal lo
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Users fetch karne mein error", error: error.message });
  }
});

// @desc    Delete a user (Admin use only)
// @route   DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (user) {
      res.json({ message: "User successfully delete ho gaya" });
    } else {
      res.status(404).json({ message: "User nahi mila" });
    }
  } catch (error) {
    res.status(500).json({ message: "Delete karne mein error", error: error.message });
  }
});

export default router;
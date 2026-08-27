import express from 'express';
import {
  applyTechnician,
  getTechnicians,
  updateTechnicianStatus,
  deleteTechnician,
} from '../controllers/technicianController.js';

const router = express.Router();

// Public route for candidates applying
router.post('/apply', applyTechnician);

// Admin routes for managing applicants
router.get('/', getTechnicians);
router.put('/:id', updateTechnicianStatus);
router.delete('/:id', deleteTechnician);

export default router;

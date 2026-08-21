import express from 'express';
import { uploadCloud } from '../utils/Cloudinary.js';
import { protect, admin } from '../middleware/authMiddleware.js'; 
import { 
  getParts, 
  getPartById, 
  createPart, 
  updatePart, 
  deletePart,
  getLowStockParts,
  seedParts
} from '../controllers/partController.js';

const router = express.Router();

router.get('/seed', seedParts);
router.route('/low-stock').get(protect, admin, getLowStockParts);

router.route('/')
  .get(getParts) 
  .post(protect, admin, uploadCloud.single('image'), createPart); // Cloudinary upload middleware

router.route('/:id')
  .get(getPartById)
  .put(protect, admin, uploadCloud.single('image'), updatePart) // Cloudinary upload middleware
  .delete(protect, admin, deletePart);

export default router;
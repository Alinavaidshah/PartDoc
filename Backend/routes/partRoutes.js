import express from 'express';
import { upload } from '../middleware/multer.js';
// Naya import:
import { protect, admin } from '../middleware/authMiddleware.js'; 
import { 
  getParts, 
  getPartById, 
  createPart, 
  updatePart, 
  deletePart,
  getLowStockParts 
} from '../controllers/partController.js';

const router = express.Router();

// GET routes public rakh sakte ho agar website par parts dikhane hain
router.route('/low-stock').get(protect, admin, getLowStockParts);

router.route('/')
  .get(getParts) 
  .post(protect, admin, upload.single('image'), createPart); // Protected

router.route('/:id')
  .get(getPartById)
  .put(protect, admin, upload.single('image'), updatePart) // Protected
  .delete(protect, admin, deletePart); // Protected

export default router;
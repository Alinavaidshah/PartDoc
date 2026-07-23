import express from 'express';
import { 
    addOrderItems, 
    getOrders, 
    getOrderById, 
    updateOrderStatus 
} from '../controllers/orderController.js';
import { upload } from '../middleware/upload.js'; 
// Naya import:
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', upload.single('receipt'), addOrderItems);


router.get('/', protect, admin, getOrders);


router.get('/:id', protect, getOrderById);


router.put('/:id', protect, admin, updateOrderStatus);

export default router;
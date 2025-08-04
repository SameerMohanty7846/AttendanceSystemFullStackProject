import express from 'express';
import { checkIn } from '../controllers/checkInController.js';
import { checkOut } from '../controllers/checkOutController.js';

const router = express.Router();

router.post('/checkin', checkIn);
router.post('/checkout', checkOut);

export default router;
import express from 'express';
export const router = express.Router();
import { registerUser, loginUser, getMe, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { forgotPassword   // ✅ ADD THIS
} from '../controllers/authController.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);
router.post('/forgot-password', forgotPassword);

export default router;

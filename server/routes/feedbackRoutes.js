import express from 'express';
const router = express.Router();
import { submitFeedback } from '../controllers/feedbackController.js';

// Public route—no auth needed
router.post('/', submitFeedback);

export default router;

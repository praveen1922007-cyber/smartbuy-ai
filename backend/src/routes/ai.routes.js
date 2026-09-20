import { Router } from 'express';
import { getRecommendation } from '../controllers/ai.controller.js';

const router = Router();

router.get('/recommendation', getRecommendation);

export default router;

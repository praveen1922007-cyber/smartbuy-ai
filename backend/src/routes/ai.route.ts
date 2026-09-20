import { Router } from 'express';
import { recommend, detectFakeReview } from '../controllers/ai.controller';

const router = Router();

router.get('/recommend', recommend);
router.post('/detect-review', detectFakeReview);

export default router;

import { Router } from 'express';
import { optimize } from '../controllers/route.controller';

const router = Router();

router.post('/optimize', optimize);

export default router;

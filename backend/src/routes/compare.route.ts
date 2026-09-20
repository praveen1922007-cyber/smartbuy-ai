import { Router } from 'express';
import { compareProducts } from '../controllers/product.compare.controller';

const router = Router();
router.get('/', compareProducts);

export default router;

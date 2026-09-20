import { Router } from 'express';
import { createProduct, getProduct, updateProduct, searchProducts, productsByStore } from '../controllers/product.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', requireAuth, createProduct);
router.get('/:id', getProduct);
router.put('/:id', requireAuth, updateProduct);
router.get('/', searchProducts);
router.get('/compare', async (req, res) => { const mod = await import('../controllers/product.compare.controller'); return mod.compareProducts(req, res); });
router.get('/store/:storeId', productsByStore);

export default router;

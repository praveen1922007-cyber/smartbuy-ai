import { Router } from 'express';
import healthRoute from './health.route';
import authRoute from './auth.route';
import storeRoute from './store.route';
import productRoute from './product.route';
import aiRoute from './ai.route';
import routeRoute from './route.route';
import compareRoute from './compare.route';
import marketplaceRoute from './marketplace.route';

const router = Router();

router.use('/health', healthRoute);
router.use('/auth', authRoute);
router.use('/stores', storeRoute);
router.use('/products', productRoute);
router.use('/products/compare', compareRoute);
router.use('/marketplace', marketplaceRoute);
router.use('/ai', aiRoute);
router.use('/route', routeRoute);

// placeholder for api v1
router.get('/', (_req, res) => res.json({ message: 'SmartBuy AI API' }));

export default router;

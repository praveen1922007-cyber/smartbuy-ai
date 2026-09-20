import { Router } from 'express';
import { getStoreById, listStores } from '../controllers/store.controller.js';

const router = Router();

router.get('/', listStores);
router.get('/:id', getStoreById);

export default router;

import { Router } from 'express';
import { createStore, getStore, nearby, listStores } from '../controllers/store.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// create store - store owners only
router.post('/', requireAuth, createStore);
router.get('/:id', getStore);
router.get('/', listStores);
router.get('/nearby', nearby);

export default router;

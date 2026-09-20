import { Router } from 'express';
import { compareByBarcode } from '../controllers/marketplace.controller';
import { ingestAndPersist, getHistoryByBarcode } from '../controllers/marketplace.controller';

const router = Router();

router.get('/compare', compareByBarcode);
router.post('/ingest', ingestAndPersist);
router.get('/history', getHistoryByBarcode);

export default router;

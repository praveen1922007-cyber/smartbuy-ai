import { Router } from 'express';
import { register, login, refreshToken, requestPasswordReset, resetPassword } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/password/request', requestPasswordReset);
router.post('/password/reset', resetPassword);

export default router;

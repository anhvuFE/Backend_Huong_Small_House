import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { getUserById, listUsers, lockUser, unlockUser } from '../controllers/user.controller';

const router = Router();

router.get('/', authenticate, authorize('admin'), listUsers);
router.get('/:userId', authenticate, authorize('admin'), getUserById);
router.patch('/:userId/lock', authenticate, authorize('admin'), lockUser);
router.patch('/:userId/unlock', authenticate, authorize('admin'), unlockUser);

export default router;

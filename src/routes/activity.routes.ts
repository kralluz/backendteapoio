import { Router } from 'express';
import { ActivityController } from '../controllers/ActivityController';
import { authMiddleware } from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';

const router = Router();
const activityController = new ActivityController();

router.get('/my', authMiddleware, activityController.listMyActivities);
router.get('/', activityController.list);
router.get('/:id', activityController.getById);
router.post('/', authMiddleware, checkRole(['PROFESSIONAL']), activityController.create);
router.put('/:id', authMiddleware, checkRole(['PROFESSIONAL']), activityController.update);
router.delete('/:id', authMiddleware, checkRole(['PROFESSIONAL']), activityController.delete);

export default router;

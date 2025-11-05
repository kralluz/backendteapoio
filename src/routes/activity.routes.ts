import { Router } from 'express';
import { ActivityController } from '../controllers/ActivityController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const activityController = new ActivityController();

router.get('/my', authMiddleware, activityController.listMyActivities);
router.get('/', activityController.list);
router.get('/:id', activityController.getById);
router.post('/', authMiddleware, activityController.create);
router.put('/:id', authMiddleware, activityController.update);
router.delete('/:id', authMiddleware, activityController.delete);

export default router;

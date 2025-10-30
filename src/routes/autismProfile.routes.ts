import { Router } from 'express';
import { AutismProfileController } from '../controllers/AutismProfileController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const autismProfileController = new AutismProfileController();

router.get('/', authMiddleware, autismProfileController.list);
router.get('/:id', authMiddleware, autismProfileController.getById);
router.post('/', authMiddleware, autismProfileController.create);
router.put('/:id', authMiddleware, autismProfileController.update);
router.delete('/:id', authMiddleware, autismProfileController.delete);

export default router;

import { Router } from 'express';
import { CommentController } from '../controllers/CommentController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const commentController = new CommentController();

router.post('/', authMiddleware, commentController.create);
router.delete('/:id', authMiddleware, commentController.delete);

export default router;

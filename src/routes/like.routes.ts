import { Router } from 'express';
import { LikeController } from '../controllers/LikeController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const likeController = new LikeController();

router.post('/', authMiddleware, likeController.toggle);
router.get('/my-likes', authMiddleware, likeController.getMyLikes);

export default router;

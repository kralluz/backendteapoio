import { Router } from 'express';
import { FavoriteController } from '../controllers/FavoriteController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const favoriteController = new FavoriteController();

router.post('/', authMiddleware, favoriteController.toggle);
router.get('/my-favorites', authMiddleware, favoriteController.getMyFavorites);

export default router;

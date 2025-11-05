import { Router } from 'express';
import { InteractionController } from '../controllers/InteractionController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const interactionController = new InteractionController();

// Rotas de Interação (requer autenticação)
router.post('/track', authMiddleware, (req, res, next) => {
  interactionController.track(req, res).catch(next);
});

router.get('/article/:id/stats', (req, res, next) => {
  interactionController.getArticleStats(req, res).catch(next);
});

router.get('/activity/:id/stats', (req, res, next) => {
  interactionController.getActivityStats(req, res).catch(next);
});

export default router;

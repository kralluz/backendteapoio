import { Router } from 'express';
import { RecommendationController } from '../controllers/RecommendationController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const recommendationController = new RecommendationController();

// Rotas de Recomendação (requer autenticação)

// GET /api/recommendations - Recomendações gerais para o usuário
router.get('/', authMiddleware, (req, res, next) => {
  recommendationController.getRecommendations(req, res).catch(next);
});

// GET /api/recommendations/articles/:id - Artigos similares
router.get('/articles/:id', (req, res, next) => {
  recommendationController.getArticleRecommendations(req, res).catch(next);
});

// GET /api/recommendations/activities/:id - Atividades similares
router.get('/activities/:id', (req, res, next) => {
  recommendationController.getActivityRecommendations(req, res).catch(next);
});

export default router;

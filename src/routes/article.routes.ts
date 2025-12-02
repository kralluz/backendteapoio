import { Router } from 'express';
import { ArticleController } from '../controllers/ArticleController';
import { authMiddleware } from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';

const router = Router();
const articleController = new ArticleController();

/**
 * @swagger
 * /articles/my:
 *   get:
 *     summary: Listar artigos do usuário logado
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: published
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Lista de artigos do usuário
 */
router.get('/my', authMiddleware, articleController.listMyArticles);

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Listar todos os artigos
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de artigos
 */
router.get('/', articleController.list);

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: Obter um artigo específico
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do artigo
 */
router.get('/:id', articleController.getById);

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Criar novo artigo
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Artigo criado
 */
router.post('/', authMiddleware, checkRole(['PROFESSIONAL']), articleController.create);

/**
 * @swagger
 * /articles/{id}:
 *   put:
 *     summary: Atualizar artigo
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Artigo atualizado
 */
router.put('/:id', authMiddleware, checkRole(['PROFESSIONAL']), articleController.update);

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     summary: Deletar artigo
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Artigo deletado
 */
router.delete('/:id', authMiddleware, checkRole(['PROFESSIONAL']), articleController.delete);

export default router;

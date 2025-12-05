import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const userController = new UserController();

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Obter dados do usuário logado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 */
router.get('/me', authMiddleware, userController.getMe);

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Atualizar dados do usuário logado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário atualizado
 */
router.put('/me', authMiddleware, userController.updateMe);

/**
 * @swagger
 * /users/me/password:
 *   put:
 *     summary: Alterar a senha do usuário logado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       204:
 *         description: Senha alterada com sucesso
 */
router.put('/me/password', authMiddleware, userController.changePassword);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obter dados de um usuário específico
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do usuário
 */
router.get('/:id', userController.getById);

/**
 * @swagger
 * /users/{id}/articles:
 *   get:
 *     summary: Obter artigos de um usuário específico
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de artigos do usuário
 */
router.get('/:id/articles', userController.getUserArticles);

/**
 * @swagger
 * /users/{id}/activities:
 *   get:
 *     summary: Obter atividades de um usuário específico
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de atividades do usuário
 */
router.get('/:id/activities', userController.getUserActivities);

export default router;

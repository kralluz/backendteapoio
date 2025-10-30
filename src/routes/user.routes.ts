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

export default router;

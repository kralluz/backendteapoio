import { Router } from 'express';
import { UploadController } from '../controllers/UploadController';
import { authMiddleware } from '../middlewares/auth';
import { uploadArticleImage, uploadActivityImage, uploadAvatar } from '../config/cloudinary';

const router = Router();
const uploadController = new UploadController();

/**
 * @swagger
 * /api/upload/article:
 *   post:
 *     summary: Upload de imagem para artigo
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imagem enviada com sucesso
 */
router.post('/article', authMiddleware, uploadArticleImage.single('image'), uploadController.uploadImage);

/**
 * @swagger
 * /api/upload/activity:
 *   post:
 *     summary: Upload de imagem para atividade
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imagem enviada com sucesso
 */
router.post('/activity', authMiddleware, uploadActivityImage.single('image'), uploadController.uploadImage);

/**
 * @swagger
 * /api/upload/avatar:
 *   post:
 *     summary: Upload de avatar do usuário
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar enviado com sucesso
 */
router.post('/avatar', authMiddleware, uploadAvatar.single('image'), uploadController.uploadImage);

export default router;

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AppError } from '../middlewares/errorHandler';

const prisma = new PrismaClient();

const createCommentSchema = z.object({
  content: z.string().min(1),
  articleId: z.string().uuid().optional(),
  activityId: z.string().uuid().optional()
}).refine(data => data.articleId || data.activityId, {
  message: 'articleId ou activityId deve ser fornecido'
});

export class CommentController {
  async create(req: Request, res: Response) {
    const data = createCommentSchema.parse(req.body);

    const comment = await prisma.comment.create({
      data: {
        ...data,
        userId: req.userId!
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    return res.status(201).json(comment);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id }
    });

    if (!comment) {
      throw new AppError('Comentário não encontrado', 404);
    }

    if (comment.userId !== req.userId) {
      throw new AppError('Você não tem permissão para deletar este comentário', 403);
    }

    await prisma.comment.delete({
      where: { id }
    });

    return res.status(204).send();
  }
}

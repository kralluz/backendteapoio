import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const toggleLikeSchema = z.object({
  articleId: z.string().uuid().optional(),
  activityId: z.string().uuid().optional()
}).refine(data => data.articleId || data.activityId, {
  message: 'articleId ou activityId deve ser fornecido'
});

export class LikeController {
  async toggle(req: Request, res: Response) {
    const data = toggleLikeSchema.parse(req.body);
    const userId = req.userId!;

    const where: any = { userId };
    
    if (data.articleId) {
      where.articleId = data.articleId;
    } else if (data.activityId) {
      where.activityId = data.activityId;
    }

    const existingLike = await prisma.like.findFirst({ where });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id }
      });

      return res.json({ liked: false, message: 'Like removido' });
    }

    const like = await prisma.like.create({
      data: {
        userId,
        articleId: data.articleId,
        activityId: data.activityId
      }
    });

    return res.status(201).json({ liked: true, message: 'Like adicionado', like });
  }

  async getMyLikes(req: Request, res: Response) {
    const likes = await prisma.like.findMany({
      where: { userId: req.userId },
      include: {
        article: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        },
        activity: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json(likes);
  }
}

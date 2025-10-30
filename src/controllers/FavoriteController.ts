import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AppError } from '../middlewares/errorHandler';

const prisma = new PrismaClient();

const toggleFavoriteSchema = z.object({
  articleId: z.string().uuid().optional(),
  activityId: z.string().uuid().optional()
}).refine(data => data.articleId || data.activityId, {
  message: 'articleId ou activityId deve ser fornecido'
});

export class FavoriteController {
  async toggle(req: Request, res: Response) {
    const data = toggleFavoriteSchema.parse(req.body);
    const userId = req.userId!;

    const where: any = { userId };
    
    if (data.articleId) {
      where.articleId = data.articleId;
    } else if (data.activityId) {
      where.activityId = data.activityId;
    }

    const existingFavorite = await prisma.favorite.findFirst({ where });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: { id: existingFavorite.id }
      });

      return res.json({ favorited: false, message: 'Favorito removido' });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        articleId: data.articleId,
        activityId: data.activityId
      }
    });

    return res.status(201).json({ favorited: true, message: 'Favorito adicionado', favorite });
  }

  async getMyFavorites(req: Request, res: Response) {
    const favorites = await prisma.favorite.findMany({
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
            },
            _count: {
              select: {
                likes: true,
                comments: true
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
            },
            _count: {
              select: {
                likes: true,
                comments: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json(favorites);
  }
}

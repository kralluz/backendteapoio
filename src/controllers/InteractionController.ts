import { Request, Response } from 'express';
import { PrismaClient, InteractionType } from '@prisma/client';
import { z } from 'zod';
import { AppError } from '../middlewares/errorHandler';

const prisma = new PrismaClient();

const trackInteractionSchema = z.object({
  type: z.enum(['VIEW', 'CLICK', 'LIKE', 'BOOKMARK']),
  articleId: z.string().optional(),
  activityId: z.string().optional()
}).refine(
  (data) => data.articleId || data.activityId,
  { message: 'Deve fornecer articleId ou activityId' }
);

export class InteractionController {
  // Rastrear interação (artigo ou atividade)
  async track(req: Request, res: Response): Promise<Response> {
    const data = trackInteractionSchema.parse(req.body);
    const userId = req.userId!;

    // Rastrear interação de artigo
    if (data.articleId) {
        // Verificar se artigo existe
        const article = await prisma.article.findUnique({
          where: { id: data.articleId }
        });

        if (!article) {
          throw new AppError('Artigo não encontrado', 404);
        }

        // Criar ou atualizar interação
        await prisma.articleInteraction.upsert({
          where: {
            userId_articleId_type: {
              userId,
              articleId: data.articleId,
              type: data.type as InteractionType
            }
          },
          create: {
            userId,
            articleId: data.articleId,
            type: data.type as InteractionType
          },
          update: {
            createdAt: new Date() // Atualiza timestamp
          }
        });

        // Atualizar estatísticas
        const stats = await prisma.articleStats.upsert({
          where: { articleId: data.articleId },
          create: {
            articleId: data.articleId,
            viewCount: data.type === 'VIEW' ? 1 : 0,
            clickCount: data.type === 'CLICK' ? 1 : 0,
            likeCount: data.type === 'LIKE' ? 1 : 0,
            bookmarkCount: data.type === 'BOOKMARK' ? 1 : 0
          },
          update: {
            viewCount: data.type === 'VIEW' ? { increment: 1 } : undefined,
            clickCount: data.type === 'CLICK' ? { increment: 1 } : undefined,
            likeCount: data.type === 'LIKE' ? { increment: 1 } : undefined,
            bookmarkCount: data.type === 'BOOKMARK' ? { increment: 1 } : undefined
          }
        });

        return res.json({
          message: 'Interação registrada com sucesso',
          stats
        });
      }

    // Rastrear interação de atividade
    if (data.activityId) {
      // Verificar se atividade existe
      const activity = await prisma.activity.findUnique({
        where: { id: data.activityId }
      });

      if (!activity) {
        throw new AppError('Atividade não encontrada', 404);
      }

      // Criar ou atualizar interação
      await prisma.activityInteraction.upsert({
        where: {
          userId_activityId_type: {
            userId,
            activityId: data.activityId,
            type: data.type as InteractionType
          }
        },
        create: {
          userId,
          activityId: data.activityId,
          type: data.type as InteractionType
        },
        update: {
          createdAt: new Date()
        }
      });

      // Atualizar estatísticas
      const stats = await prisma.activityStats.upsert({
        where: { activityId: data.activityId },
        create: {
          activityId: data.activityId,
          viewCount: data.type === 'VIEW' ? 1 : 0,
          clickCount: data.type === 'CLICK' ? 1 : 0,
          likeCount: data.type === 'LIKE' ? 1 : 0,
          bookmarkCount: data.type === 'BOOKMARK' ? 1 : 0
        },
        update: {
          viewCount: data.type === 'VIEW' ? { increment: 1 } : undefined,
          clickCount: data.type === 'CLICK' ? { increment: 1 } : undefined,
          likeCount: data.type === 'LIKE' ? { increment: 1 } : undefined,
          bookmarkCount: data.type === 'BOOKMARK' ? { increment: 1 } : undefined
        }
      });

      return res.json({
        message: 'Interação registrada com sucesso',
        stats
      });
    }

    // Caso não tenha articleId nem activityId (não deve acontecer devido ao schema)
    throw new AppError('Deve fornecer articleId ou activityId', 400);
  }

  // Obter estatísticas de um artigo
  async getArticleStats(req: Request, res: Response) {
    const { id } = req.params;

    const stats = await prisma.articleStats.findUnique({
      where: { articleId: id }
    });

    if (!stats) {
      return res.json({
        viewCount: 0,
        clickCount: 0,
        likeCount: 0,
        bookmarkCount: 0
      });
    }

    return res.json(stats);
  }

  // Obter estatísticas de uma atividade
  async getActivityStats(req: Request, res: Response) {
    const { id } = req.params;

    const stats = await prisma.activityStats.findUnique({
      where: { activityId: id }
    });

    if (!stats) {
      return res.json({
        viewCount: 0,
        clickCount: 0,
        likeCount: 0,
        bookmarkCount: 0
      });
    }

    return res.json(stats);
  }
}

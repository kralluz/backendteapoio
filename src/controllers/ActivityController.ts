import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AppError } from '../middlewares/errorHandler';

const prisma = new PrismaClient();

const createActivitySchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  content: z.string().min(10),
  image: z.string().url().optional(),
  difficulty: z.string(),
  ageRange: z.string(),
  duration: z.number().int().positive(),
  materials: z.array(z.string()),
  steps: z.array(z.string()),
  category: z.string(),
  published: z.boolean().optional()
});

const updateActivitySchema = createActivitySchema.partial();

export class ActivityController {
  async list(req: Request, res: Response) {
    const { category, difficulty, search } = req.query;

    const where: any = { published: true };

    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const activities = await prisma.activity.findMany({
      where,
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
            comments: true,
            likes: true,
            favorites: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json(activities);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;

    const activity = await prisma.activity.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            likes: true,
            favorites: true
          }
        }
      }
    });

    if (!activity) {
      throw new AppError('Atividade não encontrada', 404);
    }

    return res.json(activity);
  }

  async create(req: Request, res: Response) {
    const data = createActivitySchema.parse(req.body);

    const activity = await prisma.activity.create({
      data: {
        ...data,
        authorId: req.userId!
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    return res.status(201).json(activity);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const data = updateActivitySchema.parse(req.body);

    const activity = await prisma.activity.findUnique({
      where: { id }
    });

    if (!activity) {
      throw new AppError('Atividade não encontrada', 404);
    }

    if (activity.authorId !== req.userId) {
      throw new AppError('Você não tem permissão para editar esta atividade', 403);
    }

    const updatedActivity = await prisma.activity.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    return res.json(updatedActivity);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const activity = await prisma.activity.findUnique({
      where: { id }
    });

    if (!activity) {
      throw new AppError('Atividade não encontrada', 404);
    }

    if (activity.authorId !== req.userId) {
      throw new AppError('Você não tem permissão para deletar esta atividade', 403);
    }

    await prisma.activity.delete({
      where: { id }
    });

    return res.status(204).send();
  }
}

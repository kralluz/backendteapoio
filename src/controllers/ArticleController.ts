import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AppError } from '../middlewares/errorHandler';

const prisma = new PrismaClient();

const createArticleSchema = z.object({
  title: z.string().min(5, 'Título deve ter no mínimo 5 caracteres'),
  content: z.string().min(10, 'Conteúdo deve ter no mínimo 10 caracteres'),
  excerpt: z.string().optional(),
  image: z.string().url().optional(),
  category: z.string(),
  readTime: z.number().int().positive().optional(),
  published: z.boolean().optional()
});

const updateArticleSchema = createArticleSchema.partial();

export class ArticleController {
  async list(req: Request, res: Response) {
    const { category, search } = req.query;

    const where: any = { published: true };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const articles = await prisma.article.findMany({
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

    return res.json(articles);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
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

    if (!article) {
      throw new AppError('Artigo não encontrado', 404);
    }

    return res.json(article);
  }

  async create(req: Request, res: Response) {
    const data = createArticleSchema.parse(req.body);

    const article = await prisma.article.create({
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

    return res.status(201).json(article);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const data = updateArticleSchema.parse(req.body);

    const article = await prisma.article.findUnique({
      where: { id }
    });

    if (!article) {
      throw new AppError('Artigo não encontrado', 404);
    }

    if (article.authorId !== req.userId) {
      throw new AppError('Você não tem permissão para editar este artigo', 403);
    }

    const updatedArticle = await prisma.article.update({
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

    return res.json(updatedArticle);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: { id }
    });

    if (!article) {
      throw new AppError('Artigo não encontrado', 404);
    }

    if (article.authorId !== req.userId) {
      throw new AppError('Você não tem permissão para deletar este artigo', 403);
    }

    await prisma.article.delete({
      where: { id }
    });

    return res.status(204).send();
  }
}

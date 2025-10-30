import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AppError } from '../middlewares/errorHandler';

const prisma = new PrismaClient();

const createProfileSchema = z.object({
  name: z.string().min(2),
  age: z.number().int().positive(),
  diagnosis: z.string(),
  level: z.string(),
  interests: z.array(z.string()),
  sensitivities: z.array(z.string()),
  strengths: z.array(z.string()),
  challenges: z.array(z.string()),
  notes: z.string().optional(),
  photo: z.string().url().optional()
});

const updateProfileSchema = createProfileSchema.partial();

export class AutismProfileController {
  async list(req: Request, res: Response) {
    const profiles = await prisma.autismProfile.findMany({
      where: { parentId: req.userId },
      orderBy: { createdAt: 'desc' }
    });

    return res.json(profiles);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;

    const profile = await prisma.autismProfile.findUnique({
      where: { id },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    if (!profile) {
      throw new AppError('Perfil não encontrado', 404);
    }

    if (profile.parentId !== req.userId) {
      throw new AppError('Você não tem permissão para visualizar este perfil', 403);
    }

    return res.json(profile);
  }

  async create(req: Request, res: Response) {
    const data = createProfileSchema.parse(req.body);

    const profile = await prisma.autismProfile.create({
      data: {
        ...data,
        parentId: req.userId!,
        createdById: req.userId
      }
    });

    return res.status(201).json(profile);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const data = updateProfileSchema.parse(req.body);

    const profile = await prisma.autismProfile.findUnique({
      where: { id }
    });

    if (!profile) {
      throw new AppError('Perfil não encontrado', 404);
    }

    if (profile.parentId !== req.userId) {
      throw new AppError('Você não tem permissão para editar este perfil', 403);
    }

    const updatedProfile = await prisma.autismProfile.update({
      where: { id },
      data
    });

    return res.json(updatedProfile);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const profile = await prisma.autismProfile.findUnique({
      where: { id }
    });

    if (!profile) {
      throw new AppError('Perfil não encontrado', 404);
    }

    if (profile.parentId !== req.userId) {
      throw new AppError('Você não tem permissão para deletar este perfil', 403);
    }

    await prisma.autismProfile.delete({
      where: { id }
    });

    return res.status(204).send();
  }
}

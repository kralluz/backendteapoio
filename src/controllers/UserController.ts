import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AppError } from '../middlewares/errorHandler';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  avatar: z.string().url().nullable().optional()
    .transform(val => val === '' ? null : val)
});

const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(6, 'A nova senha deve ter no mínimo 6 caracteres'),
});

export class UserController {
  async getMe(req: Request, res: Response) {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return res.json(user);
  }

  async updateMe(req: Request, res: Response) {
    const data = updateUserSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return res.json(user);
  }

  async changePassword(req: Request, res: Response) {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordCorrect) {
      throw new AppError('Senha atual incorreta', 400);
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.userId },
      data: {
        password: hashedNewPassword,
      },
    });

    return res.status(204).send();
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            articles: true,
            activities: true
          }
        }
      }
    });

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return res.json(user);
  }
}

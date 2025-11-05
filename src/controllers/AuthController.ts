import { Request, Response } from 'express';
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { AppError } from '../middlewares/errorHandler';

const prisma = new PrismaClient();

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres')
});

const professionalRegisterSchema = registerSchema.extend({
  crp: z.string()
    .min(1, 'CRP/CRM é obrigatório')
    .regex(/^\d{5,6}\/[A-Z]{2}$/, 'CRP/CRM inválido. Use o formato: 12345/UF (ex: 12345/SP)')
    .transform(val => val.toUpperCase()),
  specialty: z.string().min(1, 'Especialidade é obrigatória')
});

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
});

export class AuthController {
  async register(req: Request, res: Response) {
    const { email, password, name } = registerSchema.parse(req.body);

    const userExists = await prisma.user.findUnique({
      where: { email }
    });

    if (userExists) {
      throw new AppError('Email já cadastrado', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true
      }
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      user,
      token
    });
  }

  async registerProfessional(req: Request, res: Response) {
    const { email, password, name, crp, specialty } = professionalRegisterSchema.parse(req.body);

    const userExists = await prisma.user.findUnique({
      where: { email }
    });

    if (userExists) {
      throw new AppError('Email já cadastrado', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        crp,
        specialty,
        role: UserRole.PROFESSIONAL
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        crp: true,
        specialty: true,
        createdAt: true
      }
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      user,
      token
    });
  }

  async login(req: Request, res: Response) {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new AppError('Email ou senha incorretos', 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError('Email ou senha incorretos', 401);
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    return res.json({
      user: userWithoutPassword,
      token
    });
  }
}

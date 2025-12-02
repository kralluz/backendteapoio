import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from './errorHandler';

const prisma = new PrismaClient();

/**
 * Middleware para verificar se o usuário tem uma das roles permitidas
 * @param allowedRoles Array de roles permitidas (ex: ['PROFESSIONAL', 'ADMIN'])
 */
export const checkRole = (allowedRoles: string[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Buscar o usuário no banco para verificar o role
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { role: true, name: true }
      });

      if (!user) {
        throw new AppError('Usuário não encontrado', 404);
      }

      // Verificar se o role do usuário está na lista de roles permitidas
      if (!allowedRoles.includes(user.role)) {
        throw new AppError(
          `Acesso negado. Esta ação requer uma das seguintes permissões: ${allowedRoles.join(' ou ')}`,
          403
        );
      }

      // Role válido, continuar
      return next();
    } catch (error) {
      return next(error);
    }
  };
};

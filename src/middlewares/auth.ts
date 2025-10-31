import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';

interface TokenPayload {
  userId: string;
  email: string;
}



export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token not provided', 401);
  }

  const [, token] = authHeader.split(' ');

  if (!token) {
    throw new AppError('Token not provided', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    return next();
  } catch (error) {
    throw new AppError('Invalid token', 401);
  }
};

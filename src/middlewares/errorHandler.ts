import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message
    });
  }

  if (error instanceof ZodError) {
    // Pegar a primeira mensagem de erro para facilitar o uso no frontend
    const firstError = error.errors[0];
    const errorMessage = firstError ? firstError.message : 'Erro de validação';

    return res.status(400).json({
      status: 'error',
      message: errorMessage,
      errors: error.errors
    });
  }

  console.error('Internal server error:', error);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};

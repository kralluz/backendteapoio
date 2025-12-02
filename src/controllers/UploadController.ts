import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares/errorHandler';

export class UploadController {
  async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        // Use next para passar o erro para o middleware de erro
        return next(new AppError('Nenhuma imagem foi enviada', 400));
      }

      // O multer-storage-cloudinary já faz o upload e retorna a URL
      const imageUrl = (req.file as any).path;
      const publicId = (req.file as any).filename;

      console.log('Upload realizado com sucesso:', {
        url: imageUrl,
        publicId: publicId
      });

      return res.status(200).json({
        url: imageUrl,
        publicId: publicId,
        message: 'Imagem enviada com sucesso'
      });
    } catch (error: any) {
      console.error('Erro no upload:', error);
      // Use next para passar o erro para o middleware de erro
      return next(new AppError(
        error.message || 'Erro ao fazer upload da imagem',
        error.http_code || 500 // Cloudinary pode usar http_code
      ));
    }
  }

  async uploadMultipleImages(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return next(new AppError('Nenhuma imagem foi enviada', 400));
      }

      const files = req.files as Express.Multer.File[];
      const urls = files.map((file: any) => ({
        url: file.path,
        publicId: file.filename
      }));

      return res.status(200).json({
        images: urls,
        message: 'Imagens enviadas com sucesso'
      });
    } catch (error: any) {
      console.error('Erro no upload múltiplo:', error);
      return next(new AppError(
        error.message || 'Erro ao fazer upload das imagens',
        error.http_code || 500 // Cloudinary pode usar http_code
      ));
    }
  }
}

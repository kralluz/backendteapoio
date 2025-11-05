import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuração do storage para artigos
const articleStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (_req, _file) => {
    return {
      folder: 'teapoio/articles',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ width: 1200, height: 630, crop: 'limit' }]
    };
  }
});

// Configuração do storage para atividades
const activityStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (_req, _file) => {
    return {
      folder: 'teapoio/activities',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ width: 1200, height: 630, crop: 'limit' }]
    };
  }
});

// Configuração do storage para avatares
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (_req, _file) => {
    return {
      folder: 'teapoio/avatars',
      allowed_formats: ['jpg', 'jpeg', 'png'],
      transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }]
    };
  }
});

// Middlewares de upload
export const uploadArticleImage = multer({ storage: articleStorage });
export const uploadActivityImage = multer({ storage: activityStorage });
export const uploadAvatar = multer({ storage: avatarStorage });

// Função para deletar imagem do Cloudinary
export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Erro ao deletar imagem do Cloudinary:', error);
  }
};

// Função para extrair public_id da URL do Cloudinary
export const extractPublicId = (url: string): string | null => {
  try {
    const regex = /\/v\d+\/(.+)\.\w+$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    return null;
  }
};

export default cloudinary;

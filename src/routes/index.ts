import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import articleRoutes from './article.routes';
import activityRoutes from './activity.routes';
import autismProfileRoutes from './autismProfile.routes';
import commentRoutes from './comment.routes';
import likeRoutes from './like.routes';
import favoriteRoutes from './favorite.routes';
import uploadRoutes from './upload.routes';
import interactionRoutes from './interaction.routes';
import recommendationRoutes from './recommendation.routes';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/users', userRoutes);
routes.use('/articles', articleRoutes);
routes.use('/activities', activityRoutes);
routes.use('/autism-profiles', autismProfileRoutes);
routes.use('/comments', commentRoutes);
routes.use('/likes', likeRoutes);
routes.use('/favorites', favoriteRoutes);
routes.use('/upload', uploadRoutes);
routes.use('/interactions', interactionRoutes);
routes.use('/recommendations', recommendationRoutes);

export default routes;

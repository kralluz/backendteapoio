import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';

const prisma = new PrismaClient();

interface ScoredContent {
  id: string;
  score: number;
  matchingTags: number;
  [key: string]: any;
}

export class RecommendationController {
  /**
   * Extrai as top tags do usuário baseado em suas interações
   * Prioriza: BOOKMARK > LIKE > CLICK > VIEW
   */
  private async getUserTopTags(userId: string, limit: number = 10): Promise<string[]> {
    // Buscar tags de artigos com que o usuário interagiu
    const articleInteractions = await prisma.articleInteraction.findMany({
      where: { userId },
      include: {
        article: {
          select: { tags: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Buscar tags de atividades com que o usuário interagiu
    const activityInteractions = await prisma.activityInteraction.findMany({
      where: { userId },
      include: {
        activity: {
          select: { tags: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Criar mapa de tags com pontuação baseada no tipo de interação
    const tagScores = new Map<string, number>();
    const weights = {
      BOOKMARK: 4,
      LIKE: 3,
      CLICK: 2,
      VIEW: 1
    };

    // Processar interações de artigos
    articleInteractions.forEach((interaction) => {
      const weight = weights[interaction.type] || 1;
      interaction.article.tags.forEach((tag) => {
        const currentScore = tagScores.get(tag) || 0;
        tagScores.set(tag, currentScore + weight);
      });
    });

    // Processar interações de atividades
    activityInteractions.forEach((interaction) => {
      const weight = weights[interaction.type] || 1;
      interaction.activity.tags.forEach((tag) => {
        const currentScore = tagScores.get(tag) || 0;
        tagScores.set(tag, currentScore + weight);
      });
    });

    // Ordenar tags por score e retornar top N
    const sortedTags = Array.from(tagScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([tag]) => tag);

    return sortedTags;
  }

  /**
   * Calcula score de um conteúdo baseado em múltiplos fatores
   */
  private calculateScore(
    content: any,
    userTags: string[],
    stats: any,
    seedTags?: string[]
  ): number {
    let score = 0;

    // 1. Tag Matching (peso: 40%)
    const matchingTags = content.tags.filter((tag: string) => userTags.includes(tag));
    const tagMatchRatio = matchingTags.length / Math.max(userTags.length, 1);
    score += tagMatchRatio * 40;

    // 2. Popularidade (peso: 30%)
    const viewCount = stats?.viewCount || 0;
    const likeCount = stats?.likeCount || 0;
    const bookmarkCount = stats?.bookmarkCount || 0;

    const popularityScore = Math.log10(1 + viewCount) * 2 +
                           Math.log10(1 + likeCount) * 3 +
                           Math.log10(1 + bookmarkCount) * 5;
    score += Math.min(popularityScore, 30); // Cap em 30 pontos

    // 3. Recência (peso: 20%)
    const createdAt = new Date(content.createdAt);
    const now = new Date();
    const daysSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    const recencyScore = Math.max(0, 20 - (daysSinceCreation / 30) * 20);
    score += recencyScore;

    // 4. Similaridade com seed (peso: 10%) - se fornecido
    if (seedTags && seedTags.length > 0) {
      const seedMatchingTags = content.tags.filter((tag: string) => seedTags.includes(tag));
      const seedMatchRatio = seedMatchingTags.length / Math.max(seedTags.length, 1);
      score += seedMatchRatio * 10;
    }

    return score;
  }

  /**
   * GET /api/recommendations
   * Recomendações gerais para o usuário
   */
  async getRecommendations(req: Request, res: Response) {
    const userId = req.userId!;
    const { limit = 10 } = req.query;

    // 1. Extrair top tags do usuário
    const userTopTags = await this.getUserTopTags(userId, 10);

    if (userTopTags.length === 0) {
      // Usuário sem interações - retornar conteúdo popular
      const popularArticles = await prisma.article.findMany({
        where: { published: true },
        include: {
          author: {
            select: { id: true, name: true, avatar: true, specialty: true }
          },
          stats: true,
          _count: {
            select: { likes: true, comments: true, favorites: true }
          }
        },
        orderBy: [
          { createdAt: 'desc' }
        ],
        take: Number(limit)
      });

      const popularActivities = await prisma.activity.findMany({
        where: { published: true },
        include: {
          author: {
            select: { id: true, name: true, avatar: true, specialty: true }
          },
          stats: true,
          _count: {
            select: { likes: true, comments: true, favorites: true }
          }
        },
        orderBy: [
          { createdAt: 'desc' }
        ],
        take: Number(limit)
      });

      return res.json({
        articles: popularArticles,
        activities: popularActivities,
        userTags: []
      });
    }

    // 2. Buscar artigos candidatos (que têm pelo menos 1 tag em comum)
    const candidateArticles = await prisma.article.findMany({
      where: {
        published: true,
        tags: {
          hasSome: userTopTags
        },
        // Excluir artigos que o usuário já interagiu
        NOT: {
          interactions: {
            some: {
              userId,
              type: { in: ['VIEW', 'CLICK'] }
            }
          }
        }
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, specialty: true }
        },
        stats: true,
        _count: {
          select: { likes: true, comments: true, favorites: true }
        }
      },
      take: 50 // Buscar 50 candidatos para depois ranquear
    });

    // 3. Buscar atividades candidatas
    const candidateActivities = await prisma.activity.findMany({
      where: {
        published: true,
        tags: {
          hasSome: userTopTags
        },
        NOT: {
          interactions: {
            some: {
              userId,
              type: { in: ['VIEW', 'CLICK'] }
            }
          }
        }
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, specialty: true }
        },
        stats: true,
        _count: {
          select: { likes: true, comments: true, favorites: true }
        }
      },
      take: 50
    });

    // 4. Calcular score para cada candidato
    const scoredArticles: ScoredContent[] = candidateArticles.map((article) => {
      const matchingTags = article.tags.filter(tag => userTopTags.includes(tag)).length;
      const score = this.calculateScore(article, userTopTags, article.stats);

      return {
        ...article,
        score,
        matchingTags
      };
    });

    const scoredActivities: ScoredContent[] = candidateActivities.map((activity) => {
      const matchingTags = activity.tags.filter(tag => userTopTags.includes(tag)).length;
      const score = this.calculateScore(activity, userTopTags, activity.stats);

      return {
        ...activity,
        score,
        matchingTags
      };
    });

    // 5. Ordenar por score e limitar
    const topArticles = scoredArticles
      .sort((a, b) => b.score - a.score)
      .slice(0, Number(limit));

    const topActivities = scoredActivities
      .sort((a, b) => b.score - a.score)
      .slice(0, Number(limit));

    return res.json({
      articles: topArticles,
      activities: topActivities,
      userTags: userTopTags
    });
  }

  /**
   * GET /api/articles/:id/recommendations
   * Artigos similares a um artigo específico
   */
  async getArticleRecommendations(req: Request, res: Response) {
    const { id } = req.params;
    const { limit = 5 } = req.query;

    // Buscar artigo seed
    const seedArticle = await prisma.article.findUnique({
      where: { id }
    });

    if (!seedArticle) {
      throw new AppError('Artigo não encontrado', 404);
    }

    // Buscar artigos similares (com tags em comum)
    const similarArticles = await prisma.article.findMany({
      where: {
        published: true,
        id: { not: id }, // Excluir o próprio artigo
        tags: {
          hasSome: seedArticle.tags
        }
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, specialty: true }
        },
        stats: true,
        _count: {
          select: { likes: true, comments: true, favorites: true }
        }
      },
      take: 20 // Buscar 20 candidatos
    });

    // Calcular score baseado na similaridade com o seed
    const scoredArticles: ScoredContent[] = similarArticles.map((article) => {
      const matchingTags = article.tags.filter(tag => seedArticle.tags.includes(tag)).length;
      const score = this.calculateScore(article, seedArticle.tags, article.stats, seedArticle.tags);

      return {
        ...article,
        score,
        matchingTags
      };
    });

    // Ordenar e limitar
    const topArticles = scoredArticles
      .sort((a, b) => b.score - a.score)
      .slice(0, Number(limit));

    return res.json({
      recommendations: topArticles,
      seedTags: seedArticle.tags
    });
  }

  /**
   * GET /api/activities/:id/recommendations
   * Atividades similares a uma atividade específica
   */
  async getActivityRecommendations(req: Request, res: Response) {
    const { id } = req.params;
    const { limit = 5 } = req.query;

    // Buscar atividade seed
    const seedActivity = await prisma.activity.findUnique({
      where: { id }
    });

    if (!seedActivity) {
      throw new AppError('Atividade não encontrada', 404);
    }

    // Buscar atividades similares
    const similarActivities = await prisma.activity.findMany({
      where: {
        published: true,
        id: { not: id },
        tags: {
          hasSome: seedActivity.tags
        }
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, specialty: true }
        },
        stats: true,
        _count: {
          select: { likes: true, comments: true, favorites: true }
        }
      },
      take: 20
    });

    // Calcular score
    const scoredActivities: ScoredContent[] = similarActivities.map((activity) => {
      const matchingTags = activity.tags.filter(tag => seedActivity.tags.includes(tag)).length;
      const score = this.calculateScore(activity, seedActivity.tags, activity.stats, seedActivity.tags);

      return {
        ...activity,
        score,
        matchingTags
      };
    });

    // Ordenar e limitar
    const topActivities = scoredActivities
      .sort((a, b) => b.score - a.score)
      .slice(0, Number(limit));

    return res.json({
      recommendations: topActivities,
      seedTags: seedActivity.tags
    });
  }
}

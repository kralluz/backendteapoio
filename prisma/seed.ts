import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.favorite.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.autismProfile.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.article.deleteMany();
  await prisma.user.deleteMany();

  // Criar usuários
  const hashedPassword = await bcrypt.hash('123456', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@teapoio.com',
      password: hashedPassword,
      name: 'Administrador TeApoio',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      role: 'ADMIN'
    }
  });

  const user1 = await prisma.user.create({
    data: {
      email: 'maria@exemplo.com',
      password: hashedPassword,
      name: 'Maria Silva',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      role: 'USER'
    }
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'joao@exemplo.com',
      password: hashedPassword,
      name: 'João Santos',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      role: 'USER'
    }
  });

  console.log('✅ Usuários criados');

  // Criar artigos
  const article1 = await prisma.article.create({
    data: {
      title: 'Entendendo o Autismo: Um Guia Completo para Pais',
      content: `O Transtorno do Espectro Autista (TEA) é uma condição neurológica que afeta o desenvolvimento...`,
      excerpt: 'Um guia abrangente para entender o autismo e como apoiar crianças no espectro',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
      category: 'Educação',
      readTime: 10,
      published: true,
      authorId: user1.id
    }
  });

  const article2 = await prisma.article.create({
    data: {
      title: 'Comunicação Alternativa e Aumentativa (CAA)',
      content: `A CAA é um conjunto de ferramentas e estratégias que ajudam pessoas com dificuldades de comunicação...`,
      excerpt: 'Descubra como a CAA pode transformar a comunicação de crianças autistas',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      category: 'Comunicação',
      readTime: 8,
      published: true,
      authorId: admin.id
    }
  });

  const article3 = await prisma.article.create({
    data: {
      title: 'Rotinas Visuais: Como Criar e Implementar',
      content: `As rotinas visuais são ferramentas poderosas que ajudam crianças autistas a entender...`,
      excerpt: 'Aprenda a criar rotinas visuais eficazes para o dia a dia',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
      category: 'Rotina',
      readTime: 6,
      published: true,
      authorId: user2.id
    }
  });

  console.log('✅ Artigos criados');

  // Criar atividades
  const activity1 = await prisma.activity.create({
    data: {
      title: 'Jogo de Cores e Formas',
      description: 'Atividade sensorial para aprender cores e formas geométricas',
      content: `Esta atividade ajuda no desenvolvimento cognitivo e sensorial...`,
      image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?auto=format&fit=crop&w=400&q=80',
      difficulty: 'Fácil',
      ageRange: '3-6 anos',
      duration: 30,
      materials: ['Papel colorido', 'Tesoura sem ponta', 'Cola', 'Formas geométricas'],
      steps: [
        'Preparar os materiais em uma mesa organizada',
        'Apresentar as cores uma por vez',
        'Deixar a criança explorar as texturas',
        'Criar padrões simples juntos'
      ],
      category: 'Sensorial',
      published: true,
      authorId: user1.id
    }
  });

  const activity2 = await prisma.activity.create({
    data: {
      title: 'Caixa Sensorial de Texturas',
      description: 'Exploração tátil com diferentes materiais e texturas',
      content: `Uma atividade para estimular o sentido do tato e reduzir sensibilidades...`,
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80',
      difficulty: 'Fácil',
      ageRange: '2-8 anos',
      duration: 20,
      materials: ['Caixa grande', 'Arroz', 'Feijão', 'Algodão', 'Lixa', 'Objetos diversos'],
      steps: [
        'Preparar a caixa com divisórias',
        'Colocar diferentes texturas em cada seção',
        'Deixar a criança explorar livremente',
        'Conversar sobre as sensações'
      ],
      category: 'Sensorial',
      published: true,
      authorId: admin.id
    }
  });

  const activity3 = await prisma.activity.create({
    data: {
      title: 'Rotina Visual do Dia',
      description: 'Criação de uma rotina visual personalizada',
      content: `Ajude sua criança a entender a sequência de atividades do dia...`,
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80',
      difficulty: 'Médio',
      ageRange: '4-10 anos',
      duration: 45,
      materials: ['Cartolina', 'Imagens impressas', 'Velcro', 'Canetas coloridas'],
      steps: [
        'Selecionar as atividades do dia',
        'Imprimir ou desenhar imagens representativas',
        'Colar velcro atrás das imagens',
        'Organizar na sequência do dia'
      ],
      category: 'Organização',
      published: true,
      authorId: user2.id
    }
  });

  console.log('✅ Atividades criadas');

  // Criar perfis autistas
  const profile1 = await prisma.autismProfile.create({
    data: {
      name: 'Lucas',
      age: 6,
      diagnosis: 'TEA Nível 1',
      level: 'Leve',
      interests: ['Dinossauros', 'Números', 'Trens'],
      sensitivities: ['Ruídos altos', 'Texturas molhadas'],
      strengths: ['Memória visual', 'Atenção aos detalhes'],
      challenges: ['Comunicação verbal', 'Interação social'],
      notes: 'Lucas responde bem a rotinas visuais e adora atividades com números',
      photo: 'https://randomuser.me/api/portraits/lego/1.jpg',
      parentId: user1.id,
      createdById: user1.id
    }
  });

  const profile2 = await prisma.autismProfile.create({
    data: {
      name: 'Ana',
      age: 4,
      diagnosis: 'TEA Nível 2',
      level: 'Moderado',
      interests: ['Animais', 'Cores', 'Música'],
      sensitivities: ['Luzes fortes', 'Mudanças na rotina'],
      strengths: ['Habilidades musicais', 'Reconhecimento de padrões'],
      challenges: ['Fala limitada', 'Alimentação seletiva'],
      notes: 'Ana usa CAA para se comunicar e adora atividades musicais',
      photo: 'https://randomuser.me/api/portraits/lego/2.jpg',
      parentId: user2.id,
      createdById: user2.id
    }
  });

  console.log('✅ Perfis autistas criados');

  // Criar comentários
  await prisma.comment.create({
    data: {
      content: 'Artigo muito esclarecedor! Ajudou muito a entender melhor meu filho.',
      userId: user2.id,
      articleId: article1.id
    }
  });

  await prisma.comment.create({
    data: {
      content: 'Excelente explicação sobre CAA. Vou implementar com minha filha!',
      userId: user1.id,
      articleId: article2.id
    }
  });

  await prisma.comment.create({
    data: {
      content: 'Fizemos esta atividade hoje e foi um sucesso! Obrigada pela dica.',
      userId: user1.id,
      activityId: activity1.id
    }
  });

  console.log('✅ Comentários criados');

  // Criar likes
  await prisma.like.create({
    data: {
      userId: user1.id,
      articleId: article2.id
    }
  });

  await prisma.like.create({
    data: {
      userId: user2.id,
      articleId: article1.id
    }
  });

  await prisma.like.create({
    data: {
      userId: user1.id,
      activityId: activity2.id
    }
  });

  console.log('✅ Likes criados');

  // Criar favoritos
  await prisma.favorite.create({
    data: {
      userId: user1.id,
      articleId: article1.id
    }
  });

  await prisma.favorite.create({
    data: {
      userId: user2.id,
      activityId: activity1.id
    }
  });

  console.log('✅ Favoritos criados');

  console.log('');
  console.log('🎉 Seed concluído com sucesso!');
  console.log('');
  console.log('📧 Usuários de teste:');
  console.log('   Admin: admin@teapoio.com / 123456');
  console.log('   User1: maria@exemplo.com / 123456');
  console.log('   User2: joao@exemplo.com / 123456');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

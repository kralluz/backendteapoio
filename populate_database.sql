-- Script SQL para popular o banco de dados TeApoio
-- Execute este script diretamente no PostgreSQL

-- Limpar dados existentes (opcional)
TRUNCATE TABLE "favorites", "likes", "comments", "autism_profiles", "activities", "articles", "users" RESTART IDENTITY CASCADE;

-- 1. USUÁRIOS
INSERT INTO "users" (id, email, password, name, avatar, role, "createdAt", "updatedAt") VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@teapoio.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador TeApoio', null, 'ADMIN', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'maria@exemplo.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Maria Silva', null, 'USER', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'joao@exemplo.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'João Santos', null, 'USER', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'ana@exemplo.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ana Costa', null, 'MODERATOR', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'pedro@exemplo.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Pedro Oliveira', null, 'USER', NOW(), NOW());

-- 2. ARTIGOS
INSERT INTO "articles" (id, title, content, excerpt, image, category, "readTime", published, "authorId", "createdAt", "updatedAt") VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Entendendo o Transtorno do Espectro Autista', 'O Transtorno do Espectro Autista (TEA) é uma condição neurológica que afeta o desenvolvimento social, comunicativo e comportamental. É importante compreender que cada pessoa no espectro é única, com suas próprias características, habilidades e desafios. O diagnóstico precoce e o apoio adequado podem fazer uma diferença significativa na qualidade de vida da pessoa autista e de sua família.', 'Uma introdução completa sobre o TEA e suas características principais.', null, 'Educação', 8, true, '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440002', 'Estratégias de Comunicação para Crianças Autistas', 'A comunicação é uma das áreas mais desafiadoras para muitas crianças no espectro autista. Este artigo apresenta estratégias práticas para melhorar a comunicação, incluindo o uso de recursos visuais, comunicação alternativa e aumentativa (CAA), e técnicas de modelagem. É fundamental adaptar as estratégias às necessidades individuais de cada criança.', 'Técnicas eficazes para melhorar a comunicação com crianças autistas.', null, 'Comunicação', 6, true, '550e8400-e29b-41d4-a716-446655440004', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440003', 'Criando Rotinas Estruturadas', 'As rotinas estruturadas são fundamentais para proporcionar segurança e previsibilidade para pessoas autistas. Este artigo explora como criar e implementar rotinas eficazes, incluindo o uso de cronogramas visuais, preparação para mudanças e estratégias para manter a flexibilidade dentro da estrutura.', 'Como estabelecer rotinas que promovem segurança e desenvolvimento.', null, 'Rotinas', 7, true, '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440004', 'Inclusão Escolar: Direitos e Práticas', 'A inclusão escolar é um direito garantido por lei. Este artigo aborda os aspectos legais da inclusão, estratégias para professores, adaptações curriculares e como as famílias podem apoiar o processo de inclusão. Também discute a importância da formação continuada dos profissionais da educação.', 'Guia completo sobre inclusão escolar para crianças autistas.', null, 'Educação', 10, true, '550e8400-e29b-41d4-a716-446655440004', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440005', 'Lidando com Crises e Comportamentos Desafiadores', 'Comportamentos desafiadores podem ser uma forma de comunicação. Este artigo oferece estratégias para compreender as causas desses comportamentos, técnicas de prevenção e intervenção, e como criar um ambiente mais acolhedor e compreensivo.', 'Estratégias para lidar com comportamentos desafiadores de forma respeitosa.', null, 'Comportamento', 9, true, '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW());

-- 3. ATIVIDADES
INSERT INTO "activities" (id, title, description, content, image, difficulty, "ageRange", duration, materials, steps, category, published, "authorId", "createdAt", "updatedAt") VALUES
('770e8400-e29b-41d4-a716-446655440001', 'Jogo da Memória com Emoções', 'Atividade para desenvolver reconhecimento de emoções e memória visual', 'Esta atividade ajuda as crianças a identificar e nomear diferentes emoções através de um jogo divertido e interativo. O jogo da memória com emoções promove o desenvolvimento da memória visual, concentração e habilidades socioemocionais.', null, 'Fácil', '4-8 anos', 20, ARRAY['Cartas com expressões faciais', 'Mesa ou superfície plana'], ARRAY['Espalhe as cartas viradas para baixo', 'Explique as regras do jogo', 'Peça para a criança virar duas cartas', 'Se formar par, nomeie a emoção', 'Continue até encontrar todos os pares'], 'Socioemocional', true, '550e8400-e29b-41d4-a716-446655440004', NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440002', 'Circuito Sensorial', 'Atividade para estimulação sensorial e coordenação motora', 'Um circuito com diferentes texturas e estímulos sensoriais para ajudar no desenvolvimento da integração sensorial. Esta atividade pode ser adaptada conforme as necessidades sensoriais específicas de cada criança.', null, 'Médio', '3-10 anos', 30, ARRAY['Almofadas', 'Tecidos com texturas diferentes', 'Bolas', 'Túnel ou caixas'], ARRAY['Monte o circuito com diferentes estações', 'Apresente cada estação à criança', 'Demonstre como passar por cada obstáculo', 'Acompanhe a criança pelo circuito', 'Adapte conforme necessário'], 'Sensorial', true, '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440003', 'História Social: Indo ao Supermercado', 'Preparação para situações sociais através de histórias', 'Uma história social personalizada para preparar a criança para a experiência de ir ao supermercado, reduzindo ansiedade e promovendo comportamentos apropriados.', null, 'Fácil', '5-12 anos', 15, ARRAY['Livro ou folhas com a história', 'Imagens do supermercado', 'Lápis de cor'], ARRAY['Leia a história com a criança', 'Discuta cada situação apresentada', 'Peça para a criança colorir as imagens', 'Pratique os comportamentos esperados', 'Revise antes de ir ao supermercado'], 'Social', true, '550e8400-e29b-41d4-a716-446655440004', NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440004', 'Caixa de Texturas', 'Exploração sensorial através do tato', 'Uma atividade de exploração sensorial que ajuda a criança a se familiarizar com diferentes texturas, desenvolvendo tolerância sensorial e vocabulário descritivo.', null, 'Fácil', '2-8 anos', 25, ARRAY['Caixa grande', 'Materiais com texturas variadas', 'Vendas para os olhos (opcional)'], ARRAY['Prepare a caixa com diferentes materiais', 'Apresente a atividade à criança', 'Deixe a criança explorar livremente', 'Descreva as texturas juntos', 'Registre as preferências da criança'], 'Sensorial', true, '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440005', 'Sequência de Rotina Matinal', 'Atividade para ensinar independência nas rotinas diárias', 'Uma sequência visual e prática para ensinar a rotina matinal, promovendo autonomia e reduzindo ansiedade relacionada às transições.', null, 'Médio', '4-12 anos', 45, ARRAY['Cartões com sequência visual', 'Cronômetro', 'Checklist'], ARRAY['Apresente os cartões da sequência', 'Demonstre cada passo da rotina', 'Pratique a sequência completa', 'Use o cronômetro para criar estrutura', 'Celebre cada conquista'], 'Autonomia', true, '550e8400-e29b-41d4-a716-446655440004', NOW(), NOW());

-- 4. PERFIS AUTISTAS
INSERT INTO "autism_profiles" (id, name, age, diagnosis, level, interests, sensitivities, strengths, challenges, notes, photo, "parentId", "createdById", "createdAt", "updatedAt") VALUES
('880e8400-e29b-41d4-a716-446655440001', 'Lucas Silva', 7, 'Transtorno do Espectro Autista', 'Nível 1', ARRAY['Dinossauros', 'Matemática', 'Quebra-cabeças'], ARRAY['Ruídos altos', 'Texturas ásperas', 'Mudanças bruscas'], ARRAY['Memória excepcional', 'Habilidades matemáticas', 'Atenção aos detalhes'], ARRAY['Comunicação social', 'Transições', 'Flexibilidade'], 'Lucas é uma criança muito inteligente que adora aprender sobre dinossauros. Precisa de avisos antes das transições.', null, '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440002', 'Sofia Santos', 5, 'Transtorno do Espectro Autista', 'Nível 2', ARRAY['Música', 'Cores', 'Animais'], ARRAY['Luzes fluorescentes', 'Multidões', 'Barulhos súbitos'], ARRAY['Criatividade', 'Memória musical', 'Carinho com animais'], ARRAY['Comunicação verbal', 'Interação social', 'Autorregulação'], 'Sofia se comunica principalmente através de gestos e algumas palavras. Adora música e se acalma ouvindo melodias suaves.', null, '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440003', 'Miguel Costa', 9, 'Transtorno do Espectro Autista', 'Nível 1', ARRAY['Computadores', 'Jogos', 'Robótica'], ARRAY['Tecidos sintéticos', 'Cheiros fortes', 'Interrupções'], ARRAY['Lógica', 'Tecnologia', 'Concentração'], ARRAY['Habilidades sociais', 'Expressão emocional', 'Mudanças de rotina'], 'Miguel tem grande interesse por tecnologia e demonstra habilidades excepcionais em programação para sua idade.', null, '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW());

-- 5. COMENTÁRIOS
INSERT INTO "comments" (id, content, "userId", "articleId", "activityId", "createdAt", "updatedAt") VALUES
('990e8400-e29b-41d4-a716-446655440001', 'Artigo muito esclarecedor! Ajudou muito na compreensão do TEA.', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', null, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440002', 'Excelentes estratégias! Vou aplicar com meu filho.', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', null, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440003', 'Atividade incrível! Minha filha adorou o jogo da memória.', '550e8400-e29b-41d4-a716-446655440002', null, '770e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440004', 'O circuito sensorial foi um sucesso aqui em casa!', '550e8400-e29b-41d4-a716-446655440005', null, '770e8400-e29b-41d4-a716-446655440002', NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440005', 'Informações muito úteis sobre inclusão escolar.', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440004', null, NOW(), NOW());

-- 6. LIKES
INSERT INTO "likes" (id, "userId", "articleId", "activityId", "createdAt") VALUES
('aa0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', null, NOW()),
('aa0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', null, NOW()),
('aa0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002', null, NOW()),
('aa0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', null, '770e8400-e29b-41d4-a716-446655440001', NOW()),
('aa0e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', null, '770e8400-e29b-41d4-a716-446655440002', NOW()),
('aa0e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440005', null, '770e8400-e29b-41d4-a716-446655440003', NOW());

-- 7. FAVORITOS
INSERT INTO "favorites" (id, "userId", "articleId", "activityId", "createdAt") VALUES
('bb0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', null, NOW()),
('bb0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', null, NOW()),
('bb0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', null, '770e8400-e29b-41d4-a716-446655440001', NOW()),
('bb0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', null, '770e8400-e29b-41d4-a716-446655440004', NOW()),
('bb0e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440005', null, NOW());

-- Verificar dados inseridos
SELECT 'Usuários' as tabela, COUNT(*) as total FROM "users"
UNION ALL
SELECT 'Artigos' as tabela, COUNT(*) as total FROM "articles"
UNION ALL
SELECT 'Atividades' as tabela, COUNT(*) as total FROM "activities"
UNION ALL
SELECT 'Perfis Autistas' as tabela, COUNT(*) as total FROM "autism_profiles"
UNION ALL
SELECT 'Comentários' as tabela, COUNT(*) as total FROM "comments"
UNION ALL
SELECT 'Likes' as tabela, COUNT(*) as total FROM "likes"
UNION ALL
SELECT 'Favoritos' as tabela, COUNT(*) as total FROM "favorites";

-- Dados de login para teste:
-- admin@teapoio.com / 123456 (ADMIN)
-- maria@exemplo.com / 123456 (USER)
-- joao@exemplo.com / 123456 (USER)
-- ana@exemplo.com / 123456 (MODERATOR)
-- pedro@exemplo.com / 123456 (USER)
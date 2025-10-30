# 🚀 TeApoio API - Backend

API completa para a plataforma TeApoio - Sistema de apoio ao autismo para pais, cuidadores e profissionais.

## 📋 Índice

- [Sobre](#sobre)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Rotas da API](#rotas-da-api)
- [Autenticação](#autenticação)
- [Estrutura do Projeto](#estrutura-do-projeto)

## 🎯 Sobre

O TeApoio é uma plataforma dedicada a fornecer recursos, atividades e informações para apoiar famílias e profissionais que trabalham com crianças no espectro autista.

### Funcionalidades

- ✅ Autenticação JWT
- ✅ Gerenciamento de usuários
- ✅ CRUD de artigos educacionais
- ✅ CRUD de atividades terapêuticas
- ✅ Perfis de crianças autistas
- ✅ Sistema de curtidas e favoritos
- ✅ Comentários em artigos e atividades
- ✅ Documentação Swagger
- ✅ Validação com Zod
- ✅ TypeScript

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Superset JavaScript tipado
- **Prisma** - ORM moderno
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Zod** - Validação de schemas
- **Swagger** - Documentação da API

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/backendteapoio.git

# Entre no diretório
cd backendteapoio

# Instale as dependências
npm install
```

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/teapoio?schema=public"
JWT_SECRET="seu-secret-key-muito-seguro-aqui"
PORT=3333
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

### 2. Banco de Dados

```bash
# Gerar cliente Prisma
npm run prisma:generate

# Executar migrations
npm run prisma:migrate

# Popular banco com dados de teste
npm run prisma:seed
```

## 🚀 Uso

### Desenvolvimento

```bash
npm run dev
```

A API estará disponível em `http://localhost:3333`

### Produção

```bash
# Build
npm run build

# Start
npm start
```

### Prisma Studio

Para visualizar e editar dados do banco:

```bash
npm run prisma:studio
```

## 📚 Rotas da API

### Documentação Swagger

Acesse: `http://localhost:3333/api-docs`

### Endpoints Principais

#### Autenticação

```
POST   /api/auth/register    - Registrar novo usuário
POST   /api/auth/login       - Login
```

#### Usuários

```
GET    /api/users/me         - Obter dados do usuário logado
PUT    /api/users/me         - Atualizar dados do usuário
GET    /api/users/:id        - Obter dados de um usuário
```

#### Artigos

```
GET    /api/articles         - Listar artigos (query: category, search)
GET    /api/articles/:id     - Obter artigo específico
POST   /api/articles         - Criar artigo (auth)
PUT    /api/articles/:id     - Atualizar artigo (auth)
DELETE /api/articles/:id     - Deletar artigo (auth)
```

#### Atividades

```
GET    /api/activities       - Listar atividades (query: category, difficulty, search)
GET    /api/activities/:id   - Obter atividade específica
POST   /api/activities       - Criar atividade (auth)
PUT    /api/activities/:id   - Atualizar atividade (auth)
DELETE /api/activities/:id   - Deletar atividade (auth)
```

#### Perfis Autistas

```
GET    /api/autism-profiles      - Listar perfis do usuário (auth)
GET    /api/autism-profiles/:id  - Obter perfil específico (auth)
POST   /api/autism-profiles      - Criar perfil (auth)
PUT    /api/autism-profiles/:id  - Atualizar perfil (auth)
DELETE /api/autism-profiles/:id  - Deletar perfil (auth)
```

#### Comentários

```
POST   /api/comments         - Criar comentário (auth)
DELETE /api/comments/:id     - Deletar comentário (auth)
```

#### Likes

```
POST   /api/likes            - Toggle like em artigo/atividade (auth)
GET    /api/likes/my-likes   - Listar meus likes (auth)
```

#### Favoritos

```
POST   /api/favorites            - Toggle favorito em artigo/atividade (auth)
GET    /api/favorites/my-favorites - Listar meus favoritos (auth)
```

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação.

### Registro

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123",
  "name": "Nome do Usuário"
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

### Usando o Token

```bash
GET /api/users/me
Authorization: Bearer SEU_TOKEN_AQUI
```

## 📁 Estrutura do Projeto

```
backendteapoio/
├── prisma/
│   ├── schema.prisma       # Schema do banco de dados
│   └── seed.ts             # Dados de teste
├── src/
│   ├── config/
│   │   └── swagger.ts      # Configuração do Swagger
│   ├── controllers/        # Controladores
│   │   ├── AuthController.ts
│   │   ├── UserController.ts
│   │   ├── ArticleController.ts
│   │   ├── ActivityController.ts
│   │   ├── AutismProfileController.ts
│   │   ├── CommentController.ts
│   │   ├── LikeController.ts
│   │   └── FavoriteController.ts
│   ├── middlewares/        # Middlewares
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   ├── routes/             # Rotas
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── article.routes.ts
│   │   ├── activity.routes.ts
│   │   ├── autismProfile.routes.ts
│   │   ├── comment.routes.ts
│   │   ├── like.routes.ts
│   │   └── favorite.routes.ts
│   └── server.ts           # Servidor Express
├── .env                    # Variáveis de ambiente
├── .env.example            # Exemplo de variáveis
├── package.json
└── tsconfig.json
```

## 👥 Usuários de Teste

Após executar o seed, você terá acesso a:

- **Admin**: admin@teapoio.com / 123456
- **Usuário 1**: maria@exemplo.com / 123456
- **Usuário 2**: joao@exemplo.com / 123456

## 🔧 Scripts Disponíveis

```bash
npm run dev              # Inicia servidor de desenvolvimento
npm run build            # Build da aplicação
npm start                # Inicia servidor de produção
npm run prisma:generate  # Gera cliente Prisma
npm run prisma:migrate   # Executa migrations
npm run prisma:studio    # Abre Prisma Studio
npm run prisma:seed      # Popula banco com dados
```

## 📝 Licença

MIT

---

**Desenvolvido com ❤️ para a comunidade autista**

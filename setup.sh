#!/bin/bash

echo "🚀 TeApoio - Setup do Backend"
echo "=============================="
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL não está instalado${NC}"
    echo "Instale com: sudo apt install postgresql postgresql-contrib"
    exit 1
fi

echo -e "${GREEN}✅ PostgreSQL encontrado${NC}"

# Verificar se o serviço está rodando
if ! sudo systemctl is-active --quiet postgresql; then
    echo -e "${YELLOW}⚠️  PostgreSQL não está rodando. Iniciando...${NC}"
    sudo systemctl start postgresql
fi

echo -e "${GREEN}✅ PostgreSQL está rodando${NC}"
echo ""

# Perguntar dados do banco
read -p "Nome do banco de dados [teapoio]: " DB_NAME
DB_NAME=${DB_NAME:-teapoio}

read -p "Usuário PostgreSQL [postgres]: " DB_USER
DB_USER=${DB_USER:-postgres}

read -sp "Senha do PostgreSQL: " DB_PASS
echo ""

# Criar banco de dados
echo ""
echo -e "${YELLOW}📦 Criando banco de dados...${NC}"
PGPASSWORD=$DB_PASS psql -U $DB_USER -h localhost -c "CREATE DATABASE $DB_NAME;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Banco de dados criado${NC}"
else
    echo -e "${YELLOW}⚠️  Banco já existe ou erro ao criar${NC}"
fi

# Atualizar .env
echo ""
echo -e "${YELLOW}⚙️  Configurando .env...${NC}"

DATABASE_URL="postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME?schema=public"

cat > .env << EOF
DATABASE_URL="$DATABASE_URL"
JWT_SECRET="teapoio-secret-key-change-this-in-production"
PORT=3333
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
EOF

echo -e "${GREEN}✅ Arquivo .env criado${NC}"

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo ""
    echo -e "${YELLOW}📦 Instalando dependências...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependências instaladas${NC}"
fi

# Gerar Prisma Client
echo ""
echo -e "${YELLOW}🔧 Gerando Prisma Client...${NC}"
npm run prisma:generate

# Executar migrations
echo ""
echo -e "${YELLOW}🔄 Executando migrations...${NC}"
npm run prisma:migrate

# Popular banco com dados
echo ""
read -p "Deseja popular o banco com dados de teste? (s/n) [s]: " SEED
SEED=${SEED:-s}

if [ "$SEED" = "s" ] || [ "$SEED" = "S" ]; then
    echo -e "${YELLOW}🌱 Populando banco de dados...${NC}"
    npm run prisma:seed
    echo -e "${GREEN}✅ Dados de teste inseridos${NC}"
    echo ""
    echo -e "${GREEN}📧 Usuários de teste:${NC}"
    echo "   - admin@teapoio.com / 123456"
    echo "   - maria@exemplo.com / 123456"
    echo "   - joao@exemplo.com / 123456"
fi

echo ""
echo -e "${GREEN}🎉 Setup concluído com sucesso!${NC}"
echo ""
echo "Para iniciar o servidor:"
echo "  npm run dev"
echo ""
echo "Acesse:"
echo "  API: http://localhost:3333"
echo "  Docs: http://localhost:3333/api-docs"
echo "  Prisma Studio: npm run prisma:studio"
echo ""

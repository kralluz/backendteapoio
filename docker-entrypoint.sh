#!/bin/sh

echo "� Iniciando aplicação TeApoio Backend..."

# Verificar se DATABASE_URL está definida
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL não está definida"
  exit 1
fi

echo "🔍 Verificando status das migrations..."
npx prisma migrate status

echo "🔧 Resolvendo possíveis conflitos de migrations..."
# Marcar migrations problemáticas antigas como aplicadas se já existirem no banco
npx prisma migrate resolve --applied 0_init 2>/dev/null || echo "ℹ️ Migration 0_init já estava resolvida ou não existe"

echo "🚀 Executando migrations..."
npx prisma migrate deploy

if [ $? -eq 0 ]; then
  echo "✅ Migrations executadas com sucesso"
else
  echo "❌ Erro ao executar migrations"
  exit 1
fi

# Run seed if SEED_DATABASE is set
if [ "$SEED_DATABASE" = "true" ]; then
  echo "🌱 Executando seed do banco de dados..."
  npx prisma db seed 2>/dev/null || echo "⚠️ Seed já executado ou não disponível"
fi

echo "✅ Iniciando servidor..."
exec node dist/server.js

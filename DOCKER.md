# 🐳 Docker - TeApoio Backend

Guia completo para deploy e execução do backend TeApoio usando Docker.

## 📋 Pré-requisitos

- Docker Engine 20.10+
- Docker Compose 2.0+
- Conta no GitHub (para push de imagens)

## 🚀 Deploy Rápido

### 1. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo para produção:

```bash
cp .env.production.example .env.production
```

Edite `.env.production` e configure:
- `DATABASE_URL` - Conexão com seu PostgreSQL
- `JWT_SECRET` - Secret forte para JWT
- `JWT_REFRESH_SECRET` - Secret forte para refresh tokens
- `FRONTEND_URL` - URL do seu frontend

### 2. Build da Imagem

```bash
# Build local
npm run docker:build

# Ou usando script auxiliar
./deploy.sh
```

### 3. Push para GitHub Container Registry

**Primeiro, faça login:**

```bash
# Gerar token em: https://github.com/settings/tokens
# Permissões: write:packages, read:packages, delete:packages
docker login ghcr.io -u kralluz
```

**Depois, faça o push:**

```bash
# Usando npm script
npm run deploy

# Ou manualmente
docker push ghcr.io/kralluz/backendteapoio:latest
```

## 🏃 Executar Aplicação

### Produção (com imagem do registry)

```bash
# Baixar imagem e executar
docker pull ghcr.io/kralluz/backendteapoio:latest
docker-compose up -d

# Ver logs
npm run docker:logs
# ou
docker-compose logs -f api
```

### Desenvolvimento Local

```bash
# Build e executar local
docker-compose up --build -d

# Parar
docker-compose down
```

## 📝 Scripts Disponíveis

```bash
npm run docker:build       # Build da imagem (sem cache)
npm run docker:push        # Push para registry
npm run docker:build-push  # Build + Push
npm run deploy             # Build sem cache + Push (recomendado)
npm run docker:up          # Subir containers
npm run docker:down        # Parar containers
npm run docker:logs        # Ver logs em tempo real
```

## 🔧 Configurações do Docker Compose

### Resources Limits

- **CPU Limit**: 2.0 cores
- **Memory Limit**: 4GB
- **CPU Reservation**: 0.5 cores
- **Memory Reservation**: 512MB

### Health Check

O container possui health check configurado:
- Endpoint: `http://localhost:3333/health`
- Intervalo: 30s
- Timeout: 10s
- Retries: 5
- Start Period: 40s

### Logs

Configuração de rotação de logs:
- Max Size: 10MB
- Max Files: 3

## 🗃️ Volumes Persistentes

- `uploads_data`: Armazena arquivos enviados
- `logs_data`: Armazena logs da aplicação

## 🔐 Segurança

O container executa como usuário não-root (`appuser`) para maior segurança.

## 📊 Monitoramento

### Ver status dos containers

```bash
docker-compose ps
```

### Ver uso de recursos

```bash
docker stats teapoio-api
```

### Ver logs específicos

```bash
# Últimas 100 linhas
docker-compose logs --tail=100 api

# Tempo real
docker-compose logs -f api

# Com timestamp
docker-compose logs -f -t api
```

## 🐛 Troubleshooting

### Container não inicia

```bash
# Ver logs completos
docker-compose logs api

# Verificar health check
docker inspect teapoio-api | grep -A 10 Health
```

### Problemas com migrations

```bash
# Entrar no container
docker exec -it teapoio-api sh

# Verificar status das migrations
npx prisma migrate status

# Aplicar migrations manualmente
npx prisma migrate deploy
```

### Resetar ambiente

```bash
# Parar e remover tudo
docker-compose down -v

# Rebuild completo
docker-compose up --build --force-recreate -d
```

## 🔄 Atualização de Versão

```bash
# 1. Build nova versão
npm run docker:build

# 2. Testar localmente (opcional)
docker-compose up -d

# 3. Push para registry
npm run docker:push

# 4. Em produção, atualizar
docker pull ghcr.io/kralluz/backendteapoio:latest
docker-compose up -d
```

## 🌐 Deploy em Servidor

### Com Docker Swarm

```bash
# Inicializar swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml teapoio

# Ver serviços
docker service ls
docker service logs teapoio_api
```

### Variáveis de Ambiente no Servidor

Crie um arquivo `.env` no servidor:

```bash
DATABASE_URL=postgresql://user:pass@host:5432/teapoio
JWT_SECRET=seu-secret-forte
JWT_REFRESH_SECRET=seu-refresh-secret-forte
FRONTEND_URL=https://seudominio.com.br
TAG=latest
```

## 📚 Mais Informações

- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

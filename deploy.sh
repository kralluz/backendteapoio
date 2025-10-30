#!/bin/bash
set -e

echo "🚀 TeApoio Backend - Deploy Script"
echo "=================================="
echo ""

# Verificar se está logado no GitHub Container Registry
echo "📦 Verificando autenticação no GitHub Container Registry..."
if ! docker info 2>/dev/null | grep -q "ghcr.io"; then
    echo "⚠️  Você precisa fazer login no GitHub Container Registry primeiro:"
    echo "   docker login ghcr.io -u kralluz"
    echo ""
    read -p "Deseja fazer login agora? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker login ghcr.io -u kralluz
    else
        echo "❌ Deploy cancelado. Faça login e tente novamente."
        exit 1
    fi
fi

echo ""
echo "🏗️  Iniciando build da imagem Docker (sem cache)..."
docker build --no-cache -t ghcr.io/kralluz/backendteapoio:latest .

echo ""
echo "📤 Enviando imagem para o GitHub Container Registry..."
docker push ghcr.io/kralluz/backendteapoio:latest

echo ""
echo "✅ Deploy concluído com sucesso!"
echo ""
echo "📝 Para usar a imagem em produção:"
echo "   docker pull ghcr.io/kralluz/backendteapoio:latest"
echo "   docker-compose up -d"

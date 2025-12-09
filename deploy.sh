#!/bin/bash

# ============================================
# RAIAR MENSAGENS - DEPLOY COM DOCKER COMPOSE
# ============================================

set -e  # Exit on error

echo "🚀 Raiar Mensagens - Deploy Script"
echo "===================================="

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para imprimir
info() {
    echo -e "${GREEN}✓${NC} $1"
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
}

# Passo 1: Verificar Docker
echo ""
echo "📋 Verificando Docker..."
if ! command -v docker &> /dev/null; then
    error "Docker não está instalado"
    exit 1
fi
if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose não está instalado"
    exit 1
fi
info "Docker e Docker Compose encontrados"

# Passo 2: Verificar .env
echo ""
echo "📋 Verificando arquivo .env..."
if [ ! -f ".env" ]; then
    warn ".env não encontrado, criando a partir de .env.example"
    cp .env.example .env
    error "Por favor, edite .env com suas variáveis!"
    echo "Abra o arquivo .env e preencha:"
    echo "  - DB_PASSWORD"
    echo "  - JWT_SECRET"
    echo "  - FRONTEND_URL"
    echo "  - BACKEND_URL"
    exit 1
fi
info ".env encontrado"

# Passo 3: Pull do Git (opcional)
if [ "$1" == "--pull" ]; then
    echo ""
    echo "📋 Puxando atualizações do Git..."
    git pull origin main
    info "Git atualizado"
fi

# Passo 4: Build
echo ""
echo "🔨 Build dos containers..."
docker-compose build
info "Build concluído"

# Passo 5: Stop containers antigos
echo ""
echo "⏹️  Parando containers antigos..."
docker-compose down || true
info "Containers parados"

# Passo 6: Start containers
echo ""
echo "▶️  Iniciando containers..."
docker-compose up -d
info "Containers iniciados"

# Passo 7: Aguardar health checks
echo ""
echo "⏳ Aguardando serviços ficarem prontos..."
sleep 5

# Passo 8: Verificar status
echo ""
echo "📊 Status dos containers:"
docker-compose ps

# Passo 9: Testar conectividade
echo ""
echo "🧪 Testando endpoints..."

# Backend
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    info "Backend respondendo em http://localhost:3001"
else
    warn "Backend ainda não está respondendo, aguarde 10 segundos..."
    sleep 10
fi

# Frontend
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    info "Frontend respondendo em http://localhost:3000"
else
    warn "Frontend ainda não está respondendo"
fi

# Passo 10: Sucesso
echo ""
echo "=========================================="
echo -e "${GREEN}✓ Deploy concluído com sucesso!${NC}"
echo "=========================================="
echo ""
echo "📍 Acesse a aplicação:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo "   Nginx: http://localhost/"
echo ""
echo "🔐 Login padrão:"
echo "   Email: admin@admin.com"
echo "   Senha: admin"
echo ""
echo "📊 Ver logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Parar:"
echo "   docker-compose down"
echo ""

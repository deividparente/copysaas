#!/bin/bash

# ================================
# RAIAR MENSAGENS - SETUP AUTOMÁTICO
# ================================

set -e

echo "🚀 Iniciando setup do Raiar Mensagens..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir com cor
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Verificar pré-requisitos
print_status "Verificando pré-requisitos..."

if ! command -v node &> /dev/null; then
    print_error "Node.js não instalado"
    exit 1
fi
print_success "Node.js $(node --version)"

if ! command -v npm &> /dev/null; then
    print_error "npm não instalado"
    exit 1
fi
print_success "npm $(npm --version)"

# Instalar dependências do backend
print_status "Instalando dependências do backend..."
cd backend
npm install
npx prisma generate
print_success "Backend configurado"

# Instalar dependências do frontend
print_status "Instalando dependências do frontend..."
cd ../frontend
npm install
print_success "Frontend configurado"

# Voltar para raiz
cd ..

# Verificar .env
print_status "Verificando arquivo .env do backend..."
if [ ! -f "backend/.env" ]; then
    print_warning "Arquivo .env não encontrado. Copiando de .env.example..."
    cp backend/.env.example backend/.env
fi

# Gerar JWT_SECRET se não existir
if grep -q "your-super-secret-jwt-key-change-in-production" backend/.env; then
    print_warning "JWT_SECRET padrão detectado. Gerando uma chave segura..."
    JWT_KEY=$(openssl rand -hex 32)
    
    # Atualizar .env com a nova chave
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/your-super-secret-jwt-key-change-in-production/$JWT_KEY/" backend/.env
    else
        # Linux
        sed -i "s/your-super-secret-jwt-key-change-in-production/$JWT_KEY/" backend/.env
    fi
    
    print_success "JWT_SECRET gerado: ${JWT_KEY:0:16}..."
fi

# Executar migrações do banco
print_status "Executando migrações do banco de dados..."
cd backend
npx prisma migrate deploy
print_success "Migrações aplicadas"

# Executar seed (opcional)
print_status "Populando banco de dados com dados iniciais..."
npm run seed
print_success "Dados iniciais adicionados"

cd ..

echo ""
echo "================================"
print_success "Setup concluído com sucesso!"
echo "================================"
echo ""
echo -e "${BLUE}Para iniciar o projeto:${NC}"
echo "  npm run start"
echo ""
echo -e "${BLUE}Ou para desenvolvimento:${NC}"
echo "  ./start.sh"
echo ""
echo -e "${YELLOW}Credentials padrão:${NC}"
echo "  Email: admin@admin.com"
echo "  Senha: (verificar no banco de dados)"
echo ""
echo -e "${BLUE}URLs:${NC}"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:3001"
echo ""

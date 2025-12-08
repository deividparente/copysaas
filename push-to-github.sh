#!/bin/bash

# Script para conectar o projeto ao GitHub e fazer push

echo "🚀 Conectando ao GitHub..."

# Inicializar Git (se ainda não estiver)
git init

# Adicionar remote do GitHub
git remote remove origin 2>/dev/null
git remote add origin https://github.com/deividparente/copysaas.git

# Criar .gitignore se não existir
if [ ! -f .gitignore ]; then
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
frontend/.next/
frontend/out/
frontend/build/

# Production
build/
dist/

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
backend/.env
frontend/.env.local

# Vercel
.vercel

# Database
backend/prisma/dev.db
backend/prisma/dev.db-journal
*.db
*.db-journal

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Netlify
.netlify/
EOF
fi

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "feat: Sistema Raiar Mensagens completo - Pronto para deploy no Vercel

- ✅ Frontend Next.js 13 com App Router
- ✅ Backend Express com Prisma ORM
- ✅ Autenticação JWT completa
- ✅ Painel administrativo
- ✅ Sistema de categorias e mensagens
- ✅ Branding kit personalizável
- ✅ Tema claro/escuro
- ✅ Sistema de novidades
- ✅ Configurado para deploy automático no Vercel
- ✅ SQLite para desenvolvimento
- ✅ Pronto para produção"

# Push para GitHub
echo ""
echo "📤 Enviando para GitHub..."
git branch -M main
git push -u origin main --force

echo ""
echo "✅ Projeto enviado para GitHub com sucesso!"
echo ""
echo "🎯 Próximos passos:"
echo "1. Acesse: https://vercel.com/new"
echo "2. Clique em 'Import Git Repository'"
echo "3. Selecione: deividparente/copysaas"
echo "4. Clique em 'Deploy'"
echo ""
echo "🚀 Seu sistema estará no ar em 2-3 minutos!"

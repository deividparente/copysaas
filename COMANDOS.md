# 🔧 Referência Rápida - Comandos Mais Usados

## 📦 Setup e Instalação

```bash
# Setup automático (instala dependências e configura banco)
npm run setup

# Instalar dependências do projeto inteiro
npm install

# Instalar apenas backend
cd backend && npm install

# Instalar apenas frontend
cd frontend && npm install
```

---

## 🚀 Desenvolvimento Local

```bash
# Rodar frontend + backend
npm run dev

# Rodar apenas backend (porta 3001)
npm run backend:dev

# Rodar apenas frontend (porta 3000)
npm run frontend:dev

# Usar script de inicio avançado
./start.sh
```

---

## 🐳 Docker

```bash
# Iniciar todos os serviços (PostgreSQL, Backend, Frontend)
docker-compose up -d

# Ver status dos containers
docker-compose ps

# Ver logs
docker-compose logs -f

# Parar tudo
docker-compose stop

# Parar e remover containers
docker-compose down

# Remover tudo incluindo dados
docker-compose down -v

# Acessar bash dentro de um container
docker-compose exec backend sh
docker-compose exec frontend sh
docker-compose exec postgres sh
```

---

## 🗄️ Banco de Dados

```bash
# Executar migrações
npx prisma migrate deploy

# Criar nova migração
npx prisma migrate dev --name minha_migracao

# Resetar banco (apaga tudo!)
npx prisma migrate reset

# Popular banco com dados iniciais
npm run seed

# Abrir Prisma Studio (visualizar dados)
npm run prisma:studio

# Gerar Prisma Client após mudanças
npx prisma generate
```

---

## 🏗️ Build e Deploy

```bash
# Build completo (backend + frontend)
npm run build

# Build apenas backend
cd backend && npm run build

# Build apenas frontend
cd frontend && npm run build

# Iniciar versão de produção do frontend
cd frontend && npm start
```

---

## 🔍 Debugging

```bash
# Ver todas as variáveis de ambiente
env | grep DATABASE_URL
env | grep JWT_SECRET

# Testar conexão com banco
psql $DATABASE_URL

# Verificar se porta está em uso
lsof -i :3000
lsof -i :3001

# Limpar cache Next.js
cd frontend && rm -rf .next

# Limpar cache npm
npm cache clean --force
```

---

## 📁 Estrutura de Pastas

```
.
├── backend/              # API Express
│   ├── src/
│   │   ├── server.ts     # Servidor principal
│   │   ├── routes/       # Endpoints
│   │   ├── middleware/   # Autenticação, etc
│   │   └── seed.ts       # Dados iniciais
│   ├── prisma/
│   │   ├── schema.prisma # Estrutura do banco
│   │   └── seed.ts       # Script de seed
│   ├── package.json
│   └── tsconfig.json
├── frontend/             # Next.js Frontend
│   ├── app/              # App router
│   ├── components/       # React components
│   ├── contexts/         # Context API
│   ├── lib/              # Utilitários
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml    # Containers locais
├── vercel.json           # Deploy Vercel
├── netlify.toml          # Deploy Netlify
├── package.json          # Scripts do projeto
└── README.md             # Este arquivo
```

---

## 🔐 Segurança

```bash
# Gerar JWT_SECRET seguro
openssl rand -hex 32

# Verificar se .env está no .gitignore
cat .gitignore | grep ".env"

# Não fazer commit de .env
git rm --cached .env
git add .gitignore
git commit -m "Remove .env from tracking"
```

---

## 🌐 URLs de Desenvolvimento

| Serviço | URL | Nota |
|---------|-----|------|
| Frontend | http://localhost:3000 | Next.js App |
| Backend | http://localhost:3001 | Express API |
| Prisma Studio | http://localhost:5555 | Visualizar dados |
| Database | localhost:5432 | PostgreSQL (Docker) |

---

## 📊 Monitoramento

```bash
# Ver recursos usados
docker stats

# Ver logs em tempo real
docker-compose logs -f backend

# Ver logs de uma data específica
docker-compose logs --since 2024-01-01 backend

# Contar linhas de log
docker-compose logs backend | wc -l

# Buscar erro específico nos logs
docker-compose logs backend | grep -i error
```

---

## 🔄 Git Workflow

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/raiar-mensagens.git

# Criar branch para feature
git checkout -b feature/minha-feature

# Ver mudanças
git status
git diff

# Fazer commit
git add .
git commit -m "Descrição clara da mudança"

# Push para GitHub
git push origin feature/minha-feature

# Fazer pull das mudanças mais recentes
git pull origin main

# Reverter mudanças não commitadas
git checkout -- .

# Reverter último commit (mantendo mudanças)
git reset --soft HEAD~1
```

---

## 🚨 Troubleshooting Rápido

```bash
# Port em uso - liberar
lsof -i :3001 | grep -i LISTEN | awk '{print $2}' | xargs kill -9

# Node modules corrompidos - reinstalar
rm -rf node_modules package-lock.json
npm install

# Cache Next.js corrompido
rm -rf frontend/.next
cd frontend && npm run build

# Banco de dados corrompido - resetar
docker-compose down -v
docker-compose up -d postgres
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npm run seed

# Limpar tudo e começar
docker system prune -a
npm run setup
npm run dev
```

---

## 📝 Variáveis de Ambiente Importantes

```bash
# .env (backend)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/raiar
JWT_SECRET=sua-chave-secreta-aqui
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NODE_ENV=development

# .env.local (frontend - se necessário)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 🎯 Fluxo de Desenvolvimento Típico

```bash
# 1. Começar o dia
git pull origin main
npm install
npm run dev

# 2. Trabalhar em uma feature
git checkout -b feature/nova-funcionalidade
# ... fazer mudanças ...

# 3. Testar localmente
npm run dev
# Testar em http://localhost:3000

# 4. Fazer commit e push
git add .
git commit -m "Implementar nova funcionalidade"
git push origin feature/nova-funcionalidade

# 5. Abrir PR no GitHub

# 6. Após aprovação, merge
git checkout main
git pull origin main
npm run dev

# 7. Deploy (automático se configurado)
```

---

## 🔗 Links Úteis

- [Documentação Completa](./DEPLOY_COMPLETO.md)
- [Quick Start](./QUICK_START.md)
- [Plataformas de Deploy](./PLATAFORMAS.md)
- [Docker](./DOCKER.md)
- [Vercel](./DEPLOY_VERCEL.md)

---

## 💡 Tips & Tricks

```bash
# Ver porta em uso de forma mais simples
netstat -an | grep LISTEN

# Rodar comando em background
npm run dev &

# Ver processos Node rodando
ps aux | grep node

# Matar processo Node
killall node

# Criar arquivo .env do .env.example
cp backend/.env.example backend/.env

# Adicionar nova dependência
npm install nome-do-pacote
cd backend && npm install nome-do-pacote

# Remover dependência
npm uninstall nome-do-pacote

# Checar versões
node --version
npm --version
git --version
docker --version
```

---

## 🆘 Precisa de Ajuda?

1. Consulte a [Documentação Completa](./DEPLOY_COMPLETO.md)
2. Veja [QUICK_START.md](./QUICK_START.md)
3. Procure em [README.md](./README.md)
4. Abra uma [Issue no GitHub](https://github.com/seu-usuario/raiar-mensagens/issues)

---

**Última atualização**: Dezembro 2025

[← Voltar para README](./README.md)

# 🎯 Raiar Mensagens - Sistema SaaS de Mensagens

Sistema completo e moderno para gerenciamento e cópia de mensagens categorizadas. Built with Next.js, Express, Prisma e PostgreSQL.

![Status](https://img.shields.io/badge/status-stable-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-green)

---

## ✨ Features

- 🔐 **Autenticação JWT** - Segura e confiável
- 📁 **Categorização** - Organize suas mensagens por categorias e subcategorias
- 📋 **Gerenciamento** - Criar, editar e deletar mensagens facilmente
- 🎨 **Dashboard** - Interface intuitiva e responsiva
- 👥 **Multi-usuário** - Suporte a diferentes roles (Admin, User)
- 🚀 **Pronto para Deploy** - Vercel, Netlify, Railway, Heroku, Docker
- 📱 **Mobile Friendly** - Funciona perfeitamente em dispositivos móveis
- 🔄 **Sincronização** - Dados atualizados em tempo real

---

## 🚀 Quick Start (3 minutos)

```bash
# 1. Clone e configure
git clone https://github.com/seu-usuario/raiar-mensagens.git
cd raiar-mensagens
npm run setup

# 2. Inicie
npm run dev

# 3. Acesse
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

---

## 📚 Documentação

| Guia | Descrição |
|------|-----------|
| [Quick Start](./QUICK_START.md) | Começar em minutos |
| [Deploy Completo](./DEPLOY_COMPLETO.md) | Guia de todas as plataformas |
| [Vercel](./DEPLOY_VERCEL.md) | Deploy passo a passo no Vercel |
| [Docker](./DOCKER.md) | Containerização e deployment |

---

## 🌐 Deploy em Produção

### Vercel (Recomendado)
```bash
git push origin main
# Acesse vercel.com, importe seu repositório
# Configure variáveis de ambiente
# Deploy automático!
```

### Railway (Grátis)
1. Acesse railway.app
2. Conecte seu GitHub
3. Adicione PostgreSQL
4. Deploy automático

### Netlify, Heroku, Docker
Veja [DEPLOY_COMPLETO.md](./DEPLOY_COMPLETO.md)

---

## 🏗️ Stack Tecnológico

### Frontend
- **Next.js 13+** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP requests

### Backend
- **Express.js** - Node.js framework
- **Prisma ORM** - Database management
- **JWT** - Authentication
- **CORS** - Cross-origin requests

### Database
- **PostgreSQL** - Produção
- **SQLite** - Desenvolvimento

---

## 🔧 Variáveis de Ambiente

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/raiar"

# Security
JWT_SECRET="gere-com-openssl-rand-hex-32"

# URLs
FRONTEND_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3001/api"

# Environment
NODE_ENV="development"
```

**Gerar JWT_SECRET seguro:**
```bash
openssl rand -hex 32
```

---

## 📝 Scripts Úteis

```bash
# Desenvolvimento
npm run dev                 # Frontend + Backend
npm run backend:dev         # Apenas Backend
npm run frontend:dev        # Apenas Frontend

# Banco de Dados
npm run seed               # Popular dados iniciais
npm run prisma:studio      # Visualizar dados
npm run prisma:migrate     # Nova migração

# Produção
npm run build              # Build completo
```

---

## 👤 Credenciais Padrão

- **Email**: admin@admin.com
- **Senha**: (Verificar no banco de dados)

⚠️ **Mude a senha após primeiro login!**

---

## 🔐 Segurança

- ✅ JWT Authentication
- ✅ Password hashing com bcryptjs
- ✅ CORS configurado
- ✅ SQL Injection protection (Prisma)
- ✅ Variáveis sensíveis em .env
- ✅ HTTPS em produção (automático)

### Instalação

```bash
# Clone o repositório
git clone <seu-repositorio>
cd "raiar mensagens"

# Instale dependências do backend
cd backend
npm install
npx prisma migrate dev
npm run seed

# Instale dependências do frontend
cd ../frontend
npm install

# Inicie os servidores
cd ..
./start.sh
```

Acesse:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

---

## 🛠️ Tecnologias

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- SQLite (desenvolvimento) / PostgreSQL (produção)
- JWT Authentication

### Frontend
- Next.js 13 (App Router)
- React 18
- TypeScript
- Axios

---

## 📁 Estrutura do Projeto

```
raiar mensagens/
├── backend/              # API Express + Prisma
│   ├── prisma/          # Schema e migrações
│   ├── src/
│   │   ├── routes/      # Rotas da API
│   │   ├── middleware/  # Auth e validação
│   │   └── server.ts    # Servidor Express
│   └── .env.example     # Variáveis de ambiente
│
├── frontend/            # Next.js 13 App Router
│   ├── app/            # Páginas e layouts
│   ├── lib/            # API client
│   ├── contexts/       # React contexts
│   └── .env.example    # Variáveis de ambiente
│
├── vercel.json         # Configuração Vercel
├── DEPLOY_VERCEL.md    # Guia de deploy
└── README.md           # Este arquivo
```

---

## 📖 Documentação

- **[Guia de Deploy](DEPLOY_VERCEL.md)** - Deploy automático no Vercel
- **[Schema do Banco](backend/prisma/schema.prisma)** - Estrutura do banco de dados

---

## 🔧 Configuração

### Variáveis de Ambiente

#### Backend (.env)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="seu-secret-super-secreto"
FRONTEND_URL="http://localhost:3000"
NODE_ENV="development"
PORT=3001
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="/api"
```

---

## 📝 Licença

Este projeto é privado e proprietário.

---

## 🤝 Suporte

Para deploy e configuração, consulte o [Guia de Deploy](DEPLOY_VERCEL.md).

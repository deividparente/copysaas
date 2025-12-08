# Raiar Mensagens - Sistema SaaS de Mensagens

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/seu-usuario/raiar-mensagens)

Sistema completo de gerenciamento de mensagens categorizadas com autenticação, painel administrativo e personalização total de branding.

## 🚀 Deploy em 1 Clique

**[Clique aqui para fazer deploy no Vercel](DEPLOY_VERCEL.md)** - Sem configuração necessária!

### Credenciais Padrão
- Admin: `admin@raiar.com` / `Raiar@2026`
- Usuário: `usuario@raiar.com` / `Raiar@2026`

---

## ✨ Funcionalidades

### 🔐 Autenticação
- Login com JWT
- Controle de sessão
- Primeiro login obriga troca de senha
- Roles: ADMIN e USER

### 👨‍💼 Painel Administrativo
- **Usuários**: CRUD completo
- **Categorias**: Com ícones/emojis personalizados
- **Subcategorias**: Organizadas por categoria
- **Mensagens**: Sistema de cópia rápida
- **Novidades**: Avisos com texto, vídeos, imagens e botões
- **Branding Kit**: Personalização completa
  - Logo e favicon
  - Cores primária e secundária
  - Tema claro/escuro
  - Título e SEO
  - Fundo de login customizável

### 👤 Interface do Usuário
- Dashboard com categorias
- Navegação por categorias e subcategorias
- Cópia de mensagens com um clique
- Menu mobile responsivo
- Tema personalizável

---

## 💻 Desenvolvimento Local

### Pré-requisitos
- Node.js 18+

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

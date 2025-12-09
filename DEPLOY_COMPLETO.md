# 🚀 Guia Completo de Deploy

Guias de deploy para Vercel, Netlify, Railway, Heroku e outras plataformas.

---

## 📋 Pré-requisitos Universais

1. **Repositório Git**: GitHub, GitLab ou similar
2. **Banco de Dados PostgreSQL**:
   - [Supabase](https://supabase.com) (Recomendado - Grátis)
   - [Railway](https://railway.app)
   - [Vercel Postgres](https://vercel.com/postgres)
   - [Heroku Postgres](https://www.heroku.com/postgres)
   - [Azure Database](https://azure.microsoft.com/services/postgresql)

3. **Variáveis de Ambiente Necessárias**:
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=sua-chave-secreta (gere com: openssl rand -hex 32)
   FRONTEND_URL=https://seu-dominio.com
   NODE_ENV=production
   ```

---

## 🔷 Deploy no Vercel (Recomendado para Next.js)

### Passo 1: Preparar o Banco de Dados

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto PostgreSQL
3. Copie a connection string (Settings → Database)
4. Substitua `[YOUR-PASSWORD]` pela senha

### Passo 2: Conectar Repositório

1. Acesse [vercel.com](https://vercel.com)
2. Clique "Import Project"
3. Selecione seu repositório GitHub/GitLab
4. Configure:
   - **Root Directory**: (deixe vazio)
   - **Framework**: Next.js (detectado automaticamente)

### Passo 3: Configurar Variáveis de Ambiente

No Vercel, vá em **Settings → Environment Variables** e adicione:

| Chave | Valor |
|-------|-------|
| `DATABASE_URL` | `postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres` |
| `JWT_SECRET` | `resultado de: openssl rand -hex 32` |
| `FRONTEND_URL` | `https://seu-projeto.vercel.app` |
| `NODE_ENV` | `production` |
| `NEXT_PUBLIC_API_URL` | `/api` |

### Passo 4: Deploy

Clique "Deploy" e aguarde 3-5 minutos.

**URLs após deploy:**
- Frontend: `https://seu-projeto.vercel.app`
- API: `https://seu-projeto.vercel.app/api`

---

## 🟠 Deploy no Netlify

### Passo 1: Preparar o Banco de Dados

Mesmo processo do Vercel (use Supabase ou similar)

### Passo 2: Conectar Repositório

1. Acesse [netlify.com](https://netlify.com)
2. Clique "Add new site" → "Import an existing project"
3. Selecione seu repositório
4. Clique "Deploy site"

### Passo 3: Configurar Variáveis de Ambiente

No Netlify, vá em **Site settings → Build & deploy → Environment**:

```
DATABASE_URL=postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres
JWT_SECRET=sua-chave-gerada
FRONTEND_URL=https://seu-site.netlify.app
NODE_ENV=production
NEXT_PUBLIC_API_URL=/api
```

### Passo 4: Redeployar

Clique em "Trigger deploy" para recompilar com as variáveis.

---

## 🚂 Deploy no Railway

### Passo 1: Criar Banco de Dados PostgreSQL

1. Acesse [railway.app](https://railway.app)
2. Crie um novo projeto
3. Adicione PostgreSQL
4. Copie a connection string gerada

### Passo 2: Conectar Repositório

1. No Railway, clique "New"
2. Selecione "GitHub Repo"
3. Escolha seu repositório
4. Clique "Deploy"

### Passo 3: Configurar Variáveis

Railway → Variables:

```
DATABASE_URL=postgresql://...
JWT_SECRET=sua-chave
FRONTEND_URL=https://seu-app-railway.up.railway.app
NODE_ENV=production
NEXT_PUBLIC_API_URL=/api
```

### Passo 4: Deploy Automático

Railway faz deploy automático a cada push no `main`.

---

## 🟣 Deploy no Heroku

### Passo 1: Preparar o Banco de Dados

```bash
# Instale o Heroku CLI
brew install heroku/brew/heroku

# Faça login
heroku login

# Crie uma app
heroku create seu-app-nome

# Adicione PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev
```

### Passo 2: Obter Connection String

```bash
heroku config:get DATABASE_URL
```

### Passo 3: Configurar Variáveis

```bash
heroku config:set JWT_SECRET="sua-chave-gerada"
heroku config:set FRONTEND_URL="https://seu-app-nome.herokuapp.com"
heroku config:set NODE_ENV="production"
heroku config:set NEXT_PUBLIC_API_URL="/api"
```

### Passo 4: Deploy

```bash
git push heroku main
```

---

## 🌩️ Deploy na Azure

### Passo 1: Criar App Service

```bash
# Instale Azure CLI
brew install azure-cli

# Faça login
az login

# Crie resource group
az group create --name raiar-rg --location eastus

# Crie App Service
az appservice plan create --name raiar-plan --resource-group raiar-rg --sku B1
az webapp create --name seu-app --resource-group raiar-rg --plan raiar-plan --runtime "NODE|18.0"
```

### Passo 2: Configurar Banco de Dados

Use Azure Database for PostgreSQL e copie a connection string.

### Passo 3: Configurar Variáveis

```bash
az webapp config appsettings set --resource-group raiar-rg --name seu-app \
  --settings DATABASE_URL="postgresql://..." \
  JWT_SECRET="sua-chave" \
  FRONTEND_URL="https://seu-app.azurewebsites.net" \
  NODE_ENV="production"
```

### Passo 4: Deploy

```bash
az webapp deployment source config-zip --resource-group raiar-rg --name seu-app --src seu-app.zip
```

---

## 🔧 Troubleshooting Comum

### Erro: "Cannot find module 'prisma'"

```bash
# No seu repositório
cd backend
npm install
npx prisma generate
```

### Erro: "Database connection failed"

Verifique:
1. URL do banco está correta
2. Banco permite conexões externas
3. IP da plataforma está whitelisted

### Erro: "CORS errors"

Ajuste `FRONTEND_URL` no backend para o URL exato do seu frontend.

### Erro: "API returns 404"

Verifique `NEXT_PUBLIC_API_URL` no frontend - deve ser `/api` para Vercel/Netlify.

---

## ✅ Checklist Pré-Deploy

- [ ] Criou banco de dados PostgreSQL
- [ ] Testou localmente com `npm run dev` (no projeto raiz)
- [ ] Gerou JWT_SECRET com `openssl rand -hex 32`
- [ ] Fez push do código para GitHub
- [ ] Configurou todas as variáveis de ambiente
- [ ] Testou login e funcionalidades básicas

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs da plataforma (Vercel, Netlify, etc.)
2. Verifique se o banco de dados está online
3. Tente fazer seed: `npx prisma db seed`
4. Consulte a documentação oficial de cada plataforma


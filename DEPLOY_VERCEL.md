# 🚀 Deploy Vercel - Passo a Passo

## Por que Vercel?

✅ **Otimizado para Next.js** - Melhor performance  
✅ **Deploy automático** - A cada push no GitHub  
✅ **Banco de dados PostgreSQL** - Vercel Postgres integrado  
✅ **Variáveis de ambiente seguras** - Criptografadas  
✅ **Plano gratuito generoso** - Perfeito para iniciar  

---

## 📋 Checklist Pré-Deploy

- [ ] Código está no GitHub
- [ ] Banco PostgreSQL criado (Supabase, Railway, Vercel Postgres, etc.)
- [ ] Connection string do banco copiada
- [ ] JWT_SECRET gerado com `openssl rand -hex 32`

---

## Passo 1: Preparar o Banco de Dados

### Opção A: Supabase (Recomendado - Grátis)

1. Acesse [supabase.com](https://supabase.com)
2. Clique "Start your project"
3. Crie um novo projeto
   - Name: `raiar-mensagens`
   - Password: **Anote bem!**
   - Region: `us-east-1`
4. Espere o projeto ser criado
5. Vá em **Settings → Database → Connection Pooling**
6. Copie a connection string (modo TCP)
7. Substitua `[YOUR-PASSWORD]` pela senha

**Exemplo:**
```
postgresql://postgres:SuaSenha@db.xxxxx.supabase.co:5432/postgres
```

### Opção B: Vercel Postgres

1. Acesse [vercel.com/postgres](https://vercel.com/postgres)
2. Clique "Create Database"
3. Vercel criará automaticamente
4. Copie a connection string

### Opção C: Railway

1. Acesse [railway.app](https://railway.app)
2. Crie novo projeto → Add PostgreSQL
3. Copie a connection string

---

## Passo 2: Fazer Push para GitHub

```bash
# Adicione tudo ao git
git add .
git commit -m "Preparar para deploy Vercel"

# Faça push
git push origin main
```

---

## Passo 3: Conectar Vercel

### 3.1 Criar Projeto no Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique "Add New" → "Project"
3. Clique "Import Git Repository"
4. Selecione seu repositório `raiar-mensagens`
5. Clique "Import"

### 3.2 Configurar Build

Na tela "Configure Project":

- **Project Name**: `raiar-mensagens` (ou seu nome)
- **Framework**: `Next.js` (detectado automaticamente)
- **Root Directory**: Deixe em branco

Clique "Continue"

### 3.3 Adicionar Variáveis de Ambiente

Na tela "Environment Variables", adicione:

| Name | Value | Descrição |
|------|-------|-----------|
| `DATABASE_URL` | `postgresql://postgres:...` | Connection string do Supabase/Railway |
| `JWT_SECRET` | `resultado de openssl rand -hex 32` | Chave secreta (32 caracteres hex) |
| `FRONTEND_URL` | `https://raiar-mensagens.vercel.app` | Será seu URL do Vercel |
| `NODE_ENV` | `production` | Ambiente de produção |
| `NEXT_PUBLIC_API_URL` | `/api` | URL da API (relativa) |

**Como gerar JWT_SECRET:**
```bash
openssl rand -hex 32
```

Copie o resultado e cole em `JWT_SECRET`

---

## Passo 4: Deploy

1. Clique "Deploy"
2. Espere o build terminar (2-5 minutos)
3. Assim que terminar, clique "Visit"

**Pronto! 🎉**

---

## Passo 5: Teste

### 5.1 Acessar o Site

```
https://seu-projeto.vercel.app
```

### 5.2 Fazer Login

Use as credenciais padrão:
- **Email**: `admin@admin.com`
- **Senha**: Verifique no banco (execute `npm run prisma:studio`)

### 5.3 Testar Funcionalidades

1. ✅ Login funciona
2. ✅ Dashboard carrega
3. ✅ Criar categoria
4. ✅ Adicionar mensagem
5. ✅ Copiar mensagem

---

## ⚙️ Configuração Avançada (Opcional)

### Usar Vercel Postgres (Integrado)

1. No Vercel, vá em **Storage**
2. Clique "Create Database" → "Postgres"
3. Copie a connection string gerada
4. Atualize `DATABASE_URL` nas variáveis de ambiente

### Custom Domain

1. No Vercel, vá em **Settings → Domains**
2. Adicione seu domínio
3. Configure DNS em seu registrador
4. Aguarde validação (alguns minutos)

### Logging

1. No Vercel, vá em **Functions → Logs**
2. Veja logs em tempo real
3. Debugging de erros

---

## 🔐 Segurança

### Checklist de Segurança

- [ ] JWT_SECRET é único e seguro (32+ caracteres)
- [ ] DATABASE_URL não está no código (apenas em Vercel)
- [ ] `.env` está no `.gitignore`
- [ ] NODE_ENV está como "production"
- [ ] FRONTEND_URL está correto

### Proteger Variáveis

1. Variáveis de ambiente no Vercel são **criptografadas**
2. Apenas você e seu time podem vê-las
3. Cada deployment recebe uma cópia segura

---

## 🚨 Troubleshooting

### Build falha com "Cannot find module"

```bash
# Solução: Reinstale localmente
npm install
cd backend && npm install
cd ../frontend && npm install
npm run build

# Faça push novamente
git push
```

### "Database connection timeout"

1. Verifique se DATABASE_URL está correta
2. Cheque se o banco está online
3. Verifique whitelist de IPs (Supabase aceita todos por padrão)

### "API returns 404"

1. Verifique `NEXT_PUBLIC_API_URL` = `/api`
2. Verifique se backend está respondendo em `/api/*`
3. Verifique logs do Vercel

### Porta 3001 não está disponível

Vercel usa serverless functions. Backend será `/api` automaticamente.

---

## 📊 Monitoramento

### Ver Logs

1. No Vercel Dashboard, clique seu projeto
2. Vá em **Functions** → **Logs**
3. Veja requisições em tempo real

### Analytics

1. Vá em **Analytics**
2. Veja visitantes, requisições, errors
3. Performance do site

---

## 🔄 Atualizações Futuras

Após o primeiro deploy, qualquer push para `main` dispara automaticamente:

1. Build do projeto
2. Testes (se configurado)
3. Deploy automático

```bash
# Seu workflow padrão
git add .
git commit -m "Minha alteração"
git push origin main
# ✅ Vercel faz deploy automaticamente!
```

---

## 🎓 Recursos

- [Documentação Vercel Next.js](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Supabase PostgreSQL](https://supabase.com/docs/guides/database)
- [Prisma PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql)

---

## 📞 Suporte

Se tiver problemas:

1. **Verificar Logs**: Vercel Dashboard → Logs
2. **Reintentar Deploy**: Trigger deploy manualmente
3. **Resetar**: Delete o projeto e reimporte
4. **Comunidade**: [Vercel Discussions](https://github.com/vercel/next.js/discussions)

Após fazer login como admin:
1. Vá em **Branding Kit**
2. Configure:
   - Logo e Favicon
   - Cores e Tema
   - Título e SEO
   - Fundo de login

### 3. Conteúdo

1. **Categorias** - Crie suas categorias com ícones
2. **Subcategorias** - Organize por categoria
3. **Mensagens** - Adicione mensagens para copiar
4. **Novidades** - Crie avisos para usuários
5. **Usuários** - Gerencie acessos

---

## Variáveis de Ambiente (Opcional)

O sistema funciona sem configuração, mas você pode personalizar:

### No Vercel Dashboard:

**Settings** → **Environment Variables**

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `JWT_SECRET` | `seu-secret-aleatorio` | Chave para tokens JWT |
| `DATABASE_URL` | `file:./prisma/dev.db` | Banco SQLite (padrão) |

> 💡 **Dica:** Só mude se souber o que está fazendo!

---

## Atualizações

Sempre que você fizer push para o repositório:
- ✅ Vercel detecta automaticamente
- ✅ Faz novo build
- ✅ Deploy automático
- ✅ Zero downtime!

---

## Troubleshooting

### Build falha?

1. Verifique os logs no Vercel
2. Tente "Redeploy"
3. Limpe o cache: **Deployments** → **...** → **Redeploy**

### Não consegue fazer login?

Use as credenciais padrão:
- `admin@raiar.com` / `Raiar@2026`

### Dados não persistem?

SQLite funciona perfeitamente no Vercel! Os dados são salvos automaticamente.

---

## Custos

**100% GRATUITO** para:
- ✅ Projetos pessoais
- ✅ Até 100GB de bandwidth/mês
- ✅ Domínio customizado
- ✅ SSL automático
- ✅ Deploys ilimitados

---

## Suporte

- 📖 [Documentação Vercel](https://vercel.com/docs)
- 💬 [Suporte Vercel](https://vercel.com/support)

---

## Isso é Tudo!

**Não precisa:**
- ❌ Configurar banco de dados externo
- ❌ Configurar variáveis de ambiente
- ❌ Instalar nada localmente
- ❌ Fazer deploy manual

**Tudo funciona automaticamente! 🚀**

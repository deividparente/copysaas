# 🚀 Guia de Deploy no Netlify

## Pré-requisitos

1. Conta no [Netlify](https://netlify.com)
2. Conta no [Supabase](https://supabase.com) (PostgreSQL gratuito)
3. Repositório Git (GitHub, GitLab, etc.)

---

## Passo 1: Configurar Banco de Dados PostgreSQL (Supabase)

### 1.1 Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Crie um novo projeto
4. **Anote a senha do banco de dados!**

### 1.2 Obter Connection String

1. No painel do Supabase, vá em **Settings** → **Database**
2. Em "Connection string", copie a URI no formato:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
3. Substitua `[YOUR-PASSWORD]` pela senha que você criou

---

## Passo 2: Preparar o Código

### 2.1 Criar arquivo .env local

Crie `/backend/.env` com:

```env
DATABASE_URL="postgresql://postgres:[SUA-SENHA]@db.xxxxx.supabase.co:5432/postgres"
JWT_SECRET="mude-isso-para-algo-super-secreto-e-aleatorio"
FRONTEND_URL="https://seu-site.netlify.app"
NODE_ENV="production"
```

### 2.2 Rodar Migrações

```bash
cd backend
npm install
npx prisma migrate deploy
npx prisma generate
```

### 2.3 (Opcional) Popular Banco de Dados

```bash
npm run seed
```

---

## Passo 3: Deploy no Netlify

### 3.1 Conectar Repositório

1. Faça push do código para GitHub/GitLab
2. No Netlify, clique em "Add new site" → "Import an existing project"
3. Conecte seu repositório

### 3.2 Configurar Build Settings

- **Base directory**: (deixe vazio)
- **Build command**: `npm run build`
- **Publish directory**: `frontend/.next`

### 3.3 Configurar Variáveis de Ambiente

No Netlify, vá em **Site settings** → **Environment variables** e adicione:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://postgres:[SUA-SENHA]@db.xxxxx.supabase.co:5432/postgres` |
| `JWT_SECRET` | `seu-jwt-secret-super-secreto` |
| `FRONTEND_URL` | `https://seu-site.netlify.app` |
| `NODE_ENV` | `production` |
| `NEXT_PUBLIC_API_URL` | `/api` |

> ⚠️ **IMPORTANTE**: Depois de adicionar as variáveis, clique em "Trigger deploy" para reconstruir o site

---

## Passo 4: Verificar Deploy

### 4.1 Acessar o Site

1. Aguarde o build terminar (3-5 minutos)
2. Acesse a URL fornecida pelo Netlify
3. Teste o login com as credenciais padrão:
   - Email: `admin@raiar.com`
   - Senha: `Raiar@2026`

### 4.2 Configurar Domínio Customizado (Opcional)

1. No Netlify, vá em **Domain settings**
2. Clique em "Add custom domain"
3. Siga as instruções para configurar DNS

---

## Troubleshooting

### Erro: "Cannot connect to database"

- Verifique se a `DATABASE_URL` está correta
- Confirme que o IP do Netlify não está bloqueado no Supabase
- No Supabase, vá em **Settings** → **Database** → **Connection pooling** e use a connection string de lá

### Erro: "CORS policy"

- Verifique se `FRONTEND_URL` está configurada corretamente
- Deve ser exatamente a URL do Netlify (ex: `https://seu-site.netlify.app`)
- Sem barra no final

### Erro: "JWT must be provided"

- Verifique se `JWT_SECRET` está configurado
- Deve ser uma string longa e aleatória

### Build falha

- Verifique os logs no Netlify
- Confirme que todas as dependências estão no `package.json`
- Rode `npm install` localmente para verificar

---

## Comandos Úteis

### Rodar Localmente com Variáveis de Produção

```bash
# Backend
cd backend
cp .env.example .env
# Edite .env com suas credenciais
npm run dev

# Frontend
cd frontend
cp .env.example .env.local
# Edite .env.local
npm run dev
```

### Ver Logs do Netlify

```bash
netlify dev  # Roda localmente simulando Netlify
netlify logs # Ver logs de produção
```

### Resetar Banco de Dados

```bash
cd backend
npx prisma migrate reset
npm run seed
```

---

## Estrutura de Arquivos Importantes

```
raiar mensagens/
├── netlify.toml          # Configuração do Netlify
├── backend/
│   ├── .env              # Variáveis de ambiente (NÃO commitar!)
│   ├── .env.example      # Exemplo de variáveis
│   └── prisma/
│       └── schema.prisma # Schema do banco (PostgreSQL)
└── frontend/
    ├── .env.local        # Variáveis locais (NÃO commitar!)
    ├── .env.example      # Exemplo de variáveis
    └── lib/
        └── api.ts        # Cliente API (usa NEXT_PUBLIC_API_URL)
```

---

## Próximos Passos

1. ✅ Mudar senha do admin
2. ✅ Configurar branding (logo, cores, etc.)
3. ✅ Adicionar categorias e mensagens
4. ✅ Criar usuários
5. ✅ Configurar domínio customizado
6. ✅ Configurar SSL (automático no Netlify)

---

## Suporte

Se encontrar problemas:

1. Verifique os logs no Netlify
2. Verifique as variáveis de ambiente
3. Teste localmente primeiro
4. Consulte a documentação do [Netlify](https://docs.netlify.com) e [Supabase](https://supabase.com/docs)

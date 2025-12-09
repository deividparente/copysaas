# 🚀 Quick Start - Raiar Mensagens

## Para Desenvolvimento Local

### 1️⃣ Setup Inicial (primeira vez)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/raiar-mensagens.git
cd raiar-mensagens

# Execute o setup automático
npm run setup

# Ou manualmente:
./setup-automático.sh
```

### 2️⃣ Iniciar o Projeto

```bash
# Inicia frontend e backend simultaneamente
npm run dev

# Ou use o script direto
./start.sh
```

### 3️⃣ Acessar

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Prisma Studio**: execute `npm run prisma:studio`

---

## Para Deploy em Produção

### 🔷 **Vercel** (Mais fácil)

```bash
# 1. Faça push para GitHub
git push origin main

# 2. Acesse vercel.com e importe o repositório
# 3. Configure as variáveis de ambiente:
#    - DATABASE_URL (PostgreSQL)
#    - JWT_SECRET (gere com: openssl rand -hex 32)
#    - FRONTEND_URL
#    - NODE_ENV=production

# Deploy é automático!
```

### 🟠 **Netlify**

```bash
# 1. Conecte seu repositório em netlify.com
# 2. Configure as mesmas variáveis de ambiente
# 3. Build automático
```

### 🚂 **Railway**

```bash
# 1. Acesse railway.app
# 2. Crie novo projeto
# 3. Adicione PostgreSQL
# 4. Conecte seu repositório GitHub
# 5. Configure variáveis de ambiente
# Deploy automático a cada push!
```

---

## 📝 Variáveis de Ambiente Necessárias

```env
# Banco de Dados (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/database"

# Segurança
JWT_SECRET="sua-chave-secreta-32-caracteres"

# URLs
FRONTEND_URL="https://seu-frontend-url.com"
NODE_ENV="production"
NEXT_PUBLIC_API_URL="/api"
```

**Gere uma chave JWT segura:**
```bash
openssl rand -hex 32
```

---

## 🛠️ Scripts Úteis

```bash
# Desenvolvimento
npm run dev                 # Inicia frontend + backend
npm run backend:dev         # Apenas backend
npm run frontend:dev        # Apenas frontend

# Banco de dados
npm run seed               # Popular banco com dados iniciais
npm run prisma:studio      # Abrir Prisma Studio
npm run prisma:migrate     # Criar nova migração

# Produção
npm run build              # Build completo para deploy
```

---

## 🔐 Primeira Execução

Após o setup, você terá um admin padrão:

| Campo | Valor |
|-------|-------|
| Email | admin@admin.com |
| Senha | (Verificar no banco de dados) |

**⚠️ IMPORTANTE**: Mude a senha na primeira execução!

---

## 🐛 Troubleshooting

### "Cannot find module"
```bash
# Reinstale dependências
cd backend && npm install
cd ../frontend && npm install
```

### "Database connection failed"
- Verifique se DATABASE_URL está correto
- Verifique se o banco está online
- Teste a conexão manualmente

### "Port already in use"
```bash
# Altere as portas em backend/src/server.ts e frontend/.env
# Ou encerre o processo usando a porta:
lsof -i :3000  # Para encontrar
kill -9 <PID>  # Para matar
```

---

## 📚 Recursos

- [Documentação do Deploy](./DEPLOY_COMPLETO.md)
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Docs](https://nextjs.org/docs)

---

## 💡 Dicas

1. **Use `.env.example`** como referência para variáveis
2. **Nunca commite `.env`** com dados sensíveis
3. **Gere JWT_SECRET seguro** para produção
4. **Teste tudo localmente** antes de fazer deploy
5. **Use `npm run prisma:studio`** para visualizar dados


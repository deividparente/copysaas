# 🎯 COMECE AQUI

Bem-vindo ao **Raiar Mensagens**! Este documento mostra exatamente por onde começar.

---

## ⚡ 60 Segundos - O que é este projeto?

**Raiar Mensagens** é um sistema web completo para gerenciar e copiar mensagens categorizadas.

- 🔐 Autenticação segura
- 📁 Categorização de mensagens
- 👥 Multi-usuário com roles
- 🎨 Dashboard responsivo
- 🚀 Pronto para deploy em qualquer lugar

---

## 🚀 3 Passos para Começar

### 1️⃣ Setup Local (5 minutos)

```bash
# Instalar dependências e configurar banco
npm run setup

# Aguarde alguns segundos...
```

### 2️⃣ Rodar o Projeto (1 minuto)

```bash
# Inicia frontend + backend
npm run dev

# Aguarde o terminal mostrar:
# ✓ Frontend pronto em http://localhost:3000
# ✓ Backend pronto em http://localhost:3001
```

### 3️⃣ Acessar

Abra seu navegador:
- **http://localhost:3000** ← Aqui!

**Login padrão:**
- Email: `admin@admin.com`
- Senha: Verificar em "Prisma Studio" (veja abaixo)

---

## 📚 Documentação - Por Onde Ir

### 🟢 Começar Agora
- **[QUICK_START.md](./QUICK_START.md)** ← Comece aqui depois do setup

### 🔷 Fazer Deploy
- **[PLATAFORMAS.md](./PLATAFORMAS.md)** ← Escolha sua plataforma
- **[DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)** ← Recomendado (10 min)
- **[DEPLOY_COMPLETO.md](./DEPLOY_COMPLETO.md)** ← Todas as plataformas

### 🐳 Usar Docker
- **[DOCKER.md](./DOCKER.md)** ← Docker completo

### 🔧 Referência Rápida
- **[COMANDOS.md](./COMANDOS.md)** ← Comandos mais usados

### 📖 Informações Gerais
- **[README.md](./README.md)** ← Overview completo

---

## 🛠️ Comandos Mais Usados

```bash
# Setup (primeira vez)
npm run setup

# Desenvolvimento
npm run dev                  # Frontend + Backend
npm run backend:dev          # Apenas Backend
npm run frontend:dev         # Apenas Frontend

# Banco de Dados
npm run seed                 # Popular com dados iniciais
npm run prisma:studio        # Visualizar dados (GUI)

# Docker
docker-compose up -d         # Inicia tudo (com DB)
docker-compose logs -f       # Ver logs

# Deploy
npm run build                # Build para produção
```

---

## 🌐 Plataformas de Deploy (Escolha 1)

### ⭐ Vercel (Melhor para Next.js)
- Setup: 10 minutos
- Custo: Grátis
- [Guia →](./DEPLOY_VERCEL.md)

### ⭐ Railway (Inclui PostgreSQL)
- Setup: 15 minutos  
- Custo: Grátis + pago
- [Guia →](./DEPLOY_COMPLETO.md#-deploy-no-railway)

### 🟠 Netlify
- Setup: 10 minutos
- Custo: Grátis
- [Guia →](./DEPLOY_COMPLETO.md#-deploy-no-netlify)

### 🐳 Docker
- Setup: 20 minutos
- Custo: Depende
- [Guia →](./DOCKER.md)

---

## 📁 Estrutura do Projeto

```
raiar-mensagens/
├── backend/           # API (Express + Prisma)
├── frontend/          # Interface (Next.js)
├── docker-compose.yml # Desenvolvimento com Docker
├── Dockerfile         # Build de produção
├── package.json       # Scripts do projeto
└── [8 guias de documentação]
```

---

## 🔑 Variáveis de Ambiente Importantes

Arquivo: `backend/.env`

```env
DATABASE_URL="postgresql://..."  # Banco de dados
JWT_SECRET="chave-secreta"       # Gerado automaticamente
FRONTEND_URL="http://localhost:3000"
NODE_ENV="development"
```

**Gerar JWT_SECRET seguro:**
```bash
openssl rand -hex 32
```

---

## ✅ Checklist Pré-Deploy (qualquer plataforma)

- [ ] Rodei `npm run setup` com sucesso
- [ ] Testei localmente com `npm run dev`
- [ ] Criei um banco PostgreSQL
- [ ] Gerei um JWT_SECRET
- [ ] Identifiquei minha plataforma preferida
- [ ] Li o guia da plataforma

---

## 🐛 Problema? Solução Rápida

### "Não consigo fazer setup"
```bash
# Reinstale dependências
rm -rf node_modules backend/node_modules frontend/node_modules
npm install
npm run setup
```

### "Porta já está em uso"
```bash
# Mude as portas em backend/src/server.ts (padrão 3001)
# Ou mude em frontend/.env (padrão 3000)
```

### "Não consigo ver a senha"
```bash
# Use Prisma Studio
npm run prisma:studio
# Abrirá http://localhost:5555
```

Mais em **[COMANDOS.md](./COMANDOS.md)**

---

## 🚀 Próximos Passos

### Já está rodando localmente?

1. ✅ Explore o Dashboard
2. ✅ Crie uma categoria
3. ✅ Adicione uma mensagem
4. ✅ Teste copiar uma mensagem
5. ✅ Verifique os dados em `npm run prisma:studio`

### Pronto para deploy?

1. ✅ Escolha a plataforma em [PLATAFORMAS.md](./PLATAFORMAS.md)
2. ✅ Siga o guia específico
3. ✅ Deploy em 10-30 minutos
4. ✅ Compartilhe o link!

---

## 📞 Precisa de Ajuda?

### Por Tópico

| Tópico | Arquivo |
|--------|---------|
| Começar rápido | [QUICK_START.md](./QUICK_START.md) |
| Escolher plataforma | [PLATAFORMAS.md](./PLATAFORMAS.md) |
| Deploy Vercel | [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md) |
| Docker | [DOCKER.md](./DOCKER.md) |
| Referência de comandos | [COMANDOS.md](./COMANDOS.md) |
| Alterar senhas | [QUICK_START.md](./QUICK_START.md#primeira-execução) |
| Troubleshooting | [DEPLOY_COMPLETO.md](./DEPLOY_COMPLETO.md#troubleshooting-comum) |

---

## 💡 Dicas Pro

1. **Use `npm run prisma:studio`** para visualizar dados visualmente
2. **Comece no Vercel** - é o mais fácil para Next.js
3. **Faça backup** do seu banco de dados regularmente
4. **Teste em staging** antes de colocar em produção
5. **Monitore logs** regularmente

---

## 🎓 Ordem de Leitura Recomendada

```
1. Este arquivo (COMECO_AQUI.md) ✓ Já leu!
2. QUICK_START.md (5 min de leitura)
3. PLATAFORMAS.md (escolher)
4. DEPLOY_VERCEL.md ou DOCKER.md (seu guia)
5. COMANDOS.md (como referência)
6. README.md (informações gerais)
```

---

## ✨ Stack Tecnológico (FYI)

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 13+ |
| Backend | Express.js |
| Banco de Dados | PostgreSQL (produção) / SQLite (dev) |
| ORM | Prisma |
| Autenticação | JWT |
| Containerização | Docker |

---

## 🎯 Objetivos do Projeto

✅ Fácil de instalar
✅ Fácil de desenvolver
✅ Fácil de fazer deploy
✅ Fácil de manter
✅ Múltiplas opções de hospedagem

---

## 🔄 Status Atual

- ✅ Rodando em localhost
- ✅ Frontend funcional
- ✅ Backend funcional
- ✅ Banco de dados configurado
- ✅ Documentação completa
- 🟡 Pronto para seu deploy!

---

## 📊 Quick Stats

- ⏱️ Setup: 5 minutos
- 🚀 Deploy: 10-30 minutos
- 📚 Documentação: 8 guias completos
- 🎯 Plataformas: 7 opções
- 🔧 Scripts: 8 automáticos

---

## 🎉 Pronto?

### Opção 1: Continuar no Desenvolvimento Local

```bash
npm run dev
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

### Opção 2: Fazer Deploy Agora

1. Abra [PLATAFORMAS.md](./PLATAFORMAS.md)
2. Escolha sua plataforma
3. Siga o guia

### Opção 3: Aprender Mais

1. Leia [QUICK_START.md](./QUICK_START.md)
2. Explore os guias
3. Faça perguntas

---

## 🚀 Vamos lá!

**Escolha seu próximo passo:**

- 👉 [Continuar com Quick Start](./QUICK_START.md)
- 👉 [Escolher Plataforma de Deploy](./PLATAFORMAS.md)
- 👉 [Consultar Comandos](./COMANDOS.md)

---

**Sucesso! 🎉 Aproveite o Raiar Mensagens!**


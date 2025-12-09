# 🐳 Docker - Deployment Containerizado

## Por que Docker?

✅ **Ambiência consistente** - Funciona igual em qualquer máquina  
✅ **Fácil de deployar** - Suporta Heroku, Railway, DigitalOcean, AWS, etc.  
✅ **Scalabilidade** - Kubernetes ready  
✅ **Isolamento** - Sem conflitos com sistema  
✅ **Desenvolvimento** - Reproduz exatamente o ambiente de produção  

---

## Pré-requisitos

- [Docker](https://www.docker.com/products/docker-desktop) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado

**Verificar instalação:**
```bash
docker --version
docker-compose --version
```

---

## 🚀 Desenvolvimento Local com Docker

### Iniciar todos os serviços

```bash
# Inicia PostgreSQL, Backend e Frontend
docker-compose up -d

# Aguarde alguns segundos para o banco estar pronto
sleep 5

# Executar migrações
docker-compose exec backend npx prisma migrate deploy

# Executar seed (dados iniciais)
docker-compose exec backend npm run seed
```

### Acessar

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Banco de dados**: `localhost:5432`

### Ver logs

```bash
# Todos os serviços
docker-compose logs -f

# Apenas backend
docker-compose logs -f backend

# Apenas frontend
docker-compose logs -f frontend

# Apenas banco de dados
docker-compose logs -f postgres
```

### Parar os serviços

```bash
# Parar sem deletar dados
docker-compose stop

# Parar e deletar containers
docker-compose down

# Parar e deletar tudo (incluindo dados)
docker-compose down -v
```

### Acessar o bash dentro do container

```bash
# Backend
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh

# Banco de dados
docker-compose exec postgres psql -U postgres -d raiar_mensagens
```

---

## 🏗️ Build de Produção

### Build das imagens Docker

```bash
# Build completo
docker-compose build

# Build sem cache
docker-compose build --no-cache
```

### Rodar em modo produção

```bash
# Usar arquivo separado para produção
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## 🚀 Deploy em Plataformas

### Railway (Recomendado)

1. Acesse [railway.app](https://railway.app)
2. Clique "New Project" → "Deploy from GitHub"
3. Selecione seu repositório
4. Configure variáveis de ambiente
5. Railway detec automaticamente os Dockerfiles
6. Deploy automático!

**Variáveis necessárias:**
```
DATABASE_URL=postgresql://...
JWT_SECRET=seu-jwt-secret
FRONTEND_URL=https://seu-app-railway.up.railway.app
NODE_ENV=production
NEXT_PUBLIC_API_URL=/api
```

### Heroku

```bash
# Instalar Heroku CLI
brew tap heroku/brew && brew install heroku

# Login
heroku login

# Criar app
heroku create seu-app-nome

# Adicionar PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Configurar variáveis
heroku config:set JWT_SECRET="sua-chave"
heroku config:set FRONTEND_URL="https://seu-app-nome.herokuapp.com"

# Deploy
git push heroku main
```

### DigitalOcean App Platform

1. Acesse [digitalocean.com](https://www.digitalocean.com)
2. Clique "Create" → "Apps"
3. Conecte seu GitHub
4. Selecione repositório
5. DigitalOcean detecta Dockerfile
6. Configure variáveis de ambiente
7. Deploy!

### AWS ECS

```bash
# Instalar AWS CLI
brew install awscli

# Configure credenciais
aws configure

# Push para ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

docker tag raiar-backend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/raiar-backend:latest

docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/raiar-backend:latest
```

### Google Cloud Run

```bash
# Instalar Google Cloud CLI
brew install google-cloud-sdk

# Autenticar
gcloud auth login

# Build e push
gcloud builds submit --tag gcr.io/seu-projeto/raiar-backend

# Deploy
gcloud run deploy raiar-backend --image gcr.io/seu-projeto/raiar-backend --platform managed
```

---

## 📊 Monitoramento

### Ver containers rodando

```bash
docker-compose ps
```

### Ver uso de recursos

```bash
docker stats
```

### Inspecionar imagem

```bash
docker inspect raiar-backend:latest
```

---

## 🔧 Troubleshooting

### "Port already in use"

```bash
# Liberar porta
lsof -i :3000
kill -9 <PID>

# Ou usar porta diferente em docker-compose.yml
```

### "Cannot connect to database"

```bash
# Verificar se banco está rodando
docker-compose ps postgres

# Ver logs do banco
docker-compose logs postgres

# Reconectar
docker-compose down -v
docker-compose up -d postgres
sleep 5
docker-compose up -d backend
```

### "Out of memory"

```bash
# Aumentar limite de memória em docker-compose.yml
services:
  postgres:
    deploy:
      resources:
        limits:
          memory: 2G
```

### "Cannot find module"

```bash
# Reconstruir sem cache
docker-compose build --no-cache

# Limpar volumes
docker-compose down -v

# Reiniciar
docker-compose up -d
```

---

## 🔐 Segurança

### Checklist

- [ ] Usar PostgreSQL (não SQLite) em produção
- [ ] JWT_SECRET é seguro e único
- [ ] Variáveis sensíveis não estão no código
- [ ] Usar `.env` apenas localmente
- [ ] Enable multi-stage builds para reduzir tamanho

### Não fazer

❌ Commitar `.env` com dados sensíveis  
❌ Usar `root` como usuário no container  
❌ Expor portas desnecessariamente  
❌ Usar imagens desatualizadas  
❌ Manter build layers desnecessários  

---

## 📈 Performance

### Otimizar tamanho das imagens

- Use `alpine` (menor)
- Multi-stage builds
- Remove files desnecessários

### Otimizar tempo de build

- Cache layers corretamente
- Instale dependências antes de copiar código
- Use `.dockerignore`

### Exemplo de Dockerfile otimizado

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🎓 Recursos

- [Docker Docs](https://docs.docker.com)
- [Docker Compose](https://docs.docker.com/compose)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices)
- [Node.js Docker](https://nodejs.org/en/docs/guides/nodejs-docker-webapp)

---

## 🔄 CI/CD com Docker

### GitHub Actions

```yaml
name: Build and Deploy

on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker images
        run: docker-compose build
      
      - name: Push to registry
        run: docker push seu-registry/raiar-backend:latest
```

---

## 📞 Suporte

Problemas com Docker?

1. Verificar logs: `docker-compose logs`
2. Reconstruir: `docker-compose build --no-cache`
3. Limpar: `docker system prune -a`
4. Documentação: [Docker Docs](https://docs.docker.com)


# 🐳 Guia de Deploy com Docker Compose

## Pré-requisitos

- Docker instalado ([docker.com](https://docker.com))
- Docker Compose instalado (geralmente vem com Docker Desktop)
- Git instalado
- Seu repositório clonado localmente

### Verificar instalação

```bash
docker --version
docker-compose --version
```

---

## 📋 Passo 1: Preparar Variáveis de Ambiente

### 1.1 Criar arquivo `.env`

```bash
cp .env.example .env
```

### 1.2 Gerar senhas seguras

```bash
# Gere uma senha para PostgreSQL (16 caracteres hexadecimais)
openssl rand -hex 16

# Gere uma chave JWT (32 caracteres hexadecimais)
openssl rand -hex 32
```

### 1.3 Editar `.env` com seus valores

```bash
nano .env
# ou use seu editor favorito
```

Exemplo preenchido:

```env
# Database
DB_PASSWORD=a7f3e8c2b1d9e4f6

# JWT
JWT_SECRET=3c5e7a9b2d1f4e6c8a0b3d5f7a9c1e3f

# URLs (para desenvolvimento local, use localhost)
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001

# Para produção em servidor remoto
# FRONTEND_URL=http://copy.dparente.site
# BACKEND_URL=http://copys.dparente.site

# Node Environment
NODE_ENV=production
```

---

## 🚀 Passo 2: Build dos Containers

### 2.1 Build inicial (primeira vez)

```bash
docker-compose build
```

Isso vai:
- Compilar a imagem do backend
- Compilar a imagem do frontend (multi-stage)
- Baixar imagens base (postgres, nginx)

⏱️ **Tempo estimado**: 3-5 minutos (dependendo da internet)

### 2.2 Verificar build

```bash
docker images | grep -E "backend|frontend|postgres|nginx"
```

---

## ▶️ Passo 3: Iniciar os Containers

### 3.1 Iniciar serviços

```bash
docker-compose up -d
```

`-d` = detached mode (roda em background)

### 3.2 Monitorar inicialização

```bash
# Ver status dos containers
docker-compose ps

# Ver logs em tempo real
docker-compose logs -f
```

Aguarde até ver:
```
postgres_1  | LOG:  database system is ready to accept connections
backend_1   | 🚀 Server running on http://localhost:3001
frontend_1  | ready - started server on 0.0.0.0:3000
nginx_1     | ...
```

⏱️ **Tempo estimado**: 30-60 segundos (após build)

### 3.3 Verificar health dos serviços

```bash
docker-compose ps

# Esperado:
# postgres   ... "healthy"
# backend    ... "healthy"
# frontend   ... "healthy"
# nginx      ... "up"
```

---

## ✅ Verificar Instalação

### 4.1 Testar endpoints

```bash
# Backend health check
curl http://localhost:3001/health

# Frontend
curl http://localhost:3000

# Via Nginx
curl http://localhost/
```

### 4.2 Acessar aplicação

- **Frontend**: http://localhost:3000 ou http://localhost/
- **Backend API**: http://localhost:3001/api
- **Login padrão**: 
  - Email: `admin@admin.com`
  - Senha: `admin`

### 4.3 Verificar banco de dados

```bash
# Conectar ao PostgreSQL
docker-compose exec postgres psql -U raiar -d raiar_mensagens

# Dentro do psql:
\dt                    # Listar tabelas
SELECT * FROM users;   # Ver usuários
\q                     # Sair
```

---

## 📊 Gerenciar Containers

### Ver logs

```bash
# Todos os serviços
docker-compose logs -f

# Serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
docker-compose logs -f nginx

# Últimas 100 linhas
docker-compose logs --tail=100 backend
```

### Parar serviços

```bash
# Parar (mantém dados)
docker-compose stop

# Parar e remover containers
docker-compose down

# Parar, remover containers E volumes (limpa tudo)
docker-compose down -v
```

### Reiniciar

```bash
# Reiniciar todos
docker-compose restart

# Reiniciar um serviço
docker-compose restart backend
```

### Executar comandos dentro de containers

```bash
# Rodar seed manualmente
docker-compose exec backend npm run seed

# Acessar bash do backend
docker-compose exec backend sh

# Rodar migrations manualmente
docker-compose exec backend npx prisma migrate deploy

# Abrir PostgreSQL CLI
docker-compose exec postgres psql -U raiar -d raiar_mensagens
```

---

## 🔄 Atualizar Código e Re-deploy

### 5.1 Atualizar código

```bash
# Puxar atualizações do Git
git pull origin main

# Reconstruir containers (se houver mudanças em Dockerfile)
docker-compose build

# Reiniciar serviços com nova imagem
docker-compose up -d
```

### 5.2 Desenvolvimento contínuo

Se está desenvolvendo localmente, use o modo watch:

```bash
# Backend
docker-compose exec backend npm run dev

# Frontend (em outro terminal)
docker-compose exec frontend npm run dev
```

---

## 🔒 Produção (Servidor Remoto)

### 6.1 Deploy em servidor VPS/Dedicado

```bash
# 1. SSH no servidor
ssh user@seu-servidor.com

# 2. Clonar repositório
git clone https://github.com/deividparente/copysaas.git
cd copysaas

# 3. Criar .env com variáveis de produção
cp .env.example .env
nano .env  # Editar com valores de produção

# 4. Build e iniciar
docker-compose build
docker-compose up -d

# 5. Verificar
docker-compose ps
docker-compose logs
```

### 6.2 Configurar domínios (DNS)

Aponte seus domínios para o IP do servidor:

```dns
copy.dparente.site      A  SEU_IP_SERVIDOR
copys.dparente.site     A  SEU_IP_SERVIDOR
```

### 6.3 HTTPS com Let's Encrypt (Nginx + Certbot)

Para produção, **você PRECISA de HTTPS**. Opções:

#### Opção A: Usando Coolify (recomendado)
Coolify gerencia HTTPS automaticamente.

#### Opção B: Certbot standalone
```bash
# Instalar certbot
sudo apt-get install certbot python3-certbot-nginx

# Gerar certificado
sudo certbot certonly --standalone -d copy.dparente.site -d copys.dparente.site

# Atualizar nginx.conf para usar SSL
# (veja template abaixo)
```

#### Opção C: Self-signed (teste apenas)
```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

**Template nginx.conf com HTTPS:**

```nginx
events {
    worker_connections 1024;
}

http {
    # Redirect HTTP → HTTPS
    server {
        listen 80;
        server_name copy.dparente.site copys.dparente.site;
        return 301 https://$host$request_uri;
    }

    # HTTPS
    server {
        listen 443 ssl http2;
        server_name copy.dparente.site copys.dparente.site;

        ssl_certificate /etc/letsencrypt/live/copy.dparente.site/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/copy.dparente.site/privkey.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        upstream frontend {
            server frontend:3000;
        }

        upstream backend {
            server backend:3001;
        }

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # Backend API
        location /api {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto https;
        }
    }
}
```

---

## 🚨 Troubleshooting

### Port já está em uso

```bash
# Liberar porta (macOS/Linux)
lsof -i :80    # Ver qual processo usa porta 80
lsof -i :3000  # Ver qual processo usa porta 3000

# Parar container específico
docker-compose down

# Ou mudar porta em docker-compose.yml:
# ports:
#   - "8080:80"  # Usar 8080 ao invés de 80
```

### Database não inicializa

```bash
# Ver logs
docker-compose logs postgres

# Limpar volume de dados
docker-compose down -v
docker-compose up -d
```

### Backend não conecta ao banco

```bash
docker-compose logs backend

# Testar conectividade
docker-compose exec backend nc -zv postgres 5432
```

### Frontend mostra "Cannot GET /"

```bash
docker-compose logs frontend

# Verificar se Next.js buildou corretamente
docker-compose exec frontend ls -la .next/
```

### Nginx retorna 502

```bash
docker-compose logs nginx

# Testar acesso direto aos serviços
docker-compose exec nginx wget -O- http://frontend:3000
docker-compose exec nginx wget -O- http://backend:3001/health
```

---

## 📈 Monitoramento e Manutenção

### Limpeza de recursos

```bash
# Remover containers parados
docker container prune

# Remover imagens não usadas
docker image prune

# Remover volumes não usados
docker volume prune

# Limpar tudo (cuidado!)
docker system prune -a
```

### Backup do banco de dados

```bash
# Fazer dump
docker-compose exec postgres pg_dump -U raiar raiar_mensagens > backup.sql

# Restaurar
docker-compose exec -T postgres psql -U raiar raiar_mensagens < backup.sql
```

### Ver uso de recursos

```bash
docker stats
```

---

## 🔐 Segurança em Produção

- ✅ Gere senhas **diferentes e aleatórias**
- ✅ Use **HTTPS** em produção (Let's Encrypt)
- ✅ Configure **firewall** para bloquear portas internas
- ✅ **Não exponha** porta 5432 (PostgreSQL)
- ✅ Configure **backups** automáticos do banco
- ✅ Use **variáveis de ambiente** seguras (não no Git)
- ✅ Monitore **logs** regularmente

---

## 📞 Próximos Passos

- [x] Deploy com docker-compose ✓
- [ ] Configurar HTTPS com Let's Encrypt
- [ ] Configurar backups automáticos
- [ ] Configurar monitoramento (Prometheus, Grafana)
- [ ] Configurar CI/CD (GitHub Actions, GitLab CI)

Dúvidas? Execute:
```bash
docker-compose --help
docker-compose logs -f
```

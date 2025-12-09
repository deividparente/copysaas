# 🚀 Deploy no Coolify - Guia Rápido

## 📋 Pré-requisitos
- Coolify já instalado e rodando
- Acesso ao painel Coolify
- Domínios já apontados para seu servidor Coolify

---

## 🎯 Passo a Passo (5 minutos)

### Passo 1: Gerar senhas seguras

Abra um terminal e execute:

```bash
# Gere uma senha para PostgreSQL
openssl rand -hex 16

# Copie o resultado e guarde, ex:
# a7f3e8c2b1d9e4f6a7c3d5e8f9b1c3d5

# Gere uma chave JWT
openssl rand -hex 32

# Copie o resultado, ex:
# 3c5e7a9b2d1f4e6c8a0b3d5f7a9c1e3f5g7h9i1j3k5l7m9n1o3p5q
```

**Salve esses valores em um lugar seguro!**

---

### Passo 2: Acessar Coolify

1. Abra o painel Coolify (ex: http://seu-coolify:3000)
2. Clique em **"New Project"** ou **"Novo Projeto"**
3. Selecione **"Docker Compose"**

---

### Passo 3: Colar o docker-compose.yml

1. No campo **"Compose file"**, cole o conteúdo abaixo:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: raiar-postgres
    environment:
      POSTGRES_DB: raiar_mensagens
      POSTGRES_USER: raiar
      POSTGRES_PASSWORD: ${DB_PASSWORD:-changeme}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U raiar"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: https://github.com/deividparente/copysaas.git#main
      dockerfile: backend/Dockerfile
    container_name: raiar-backend
    environment:
      DATABASE_URL: postgresql://raiar:${DB_PASSWORD:-changeme}@postgres:5432/raiar_mensagens
      JWT_SECRET: ${JWT_SECRET:-changeme-with-random-string}
      FRONTEND_URL: ${FRONTEND_URL:-http://copy.dparente.site}
      NODE_ENV: production
      PORT: 3001
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3001/health"]
      interval: 10s
      timeout: 5s
      retries: 5

  frontend:
    build:
      context: https://github.com/deividparente/copysaas.git#main
      dockerfile: frontend/Dockerfile
    container_name: raiar-frontend
    environment:
      NEXT_PUBLIC_API_URL: ${BACKEND_URL:-http://copys.dparente.site}/api
    depends_on:
      backend:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 10s
      timeout: 5s
      retries: 5

  nginx:
    image: nginx:alpine
    container_name: raiar-nginx
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      frontend:
        condition: service_healthy
      backend:
        condition: service_healthy
    restart: unless-stopped

volumes:
  postgres_data:
    driver: local
```

---

### Passo 4: Configurar Variáveis de Ambiente

No painel Coolify, clique em **"Environment"** ou **"Variáveis"** e adicione:

```env
DB_PASSWORD=a7f3e8c2b1d9e4f6a7c3d5e8f9b1c3d5
JWT_SECRET=3c5e7a9b2d1f4e6c8a0b3d5f7a9c1e3f5g7h9i1j3k5l7m9n1o3p5q
FRONTEND_URL=http://copy.dparente.site
BACKEND_URL=http://copys.dparente.site
```

**Use os valores que você gerou no Passo 1!**

---

### Passo 5: Configurar nginx.conf

1. No painel Coolify, procure por **"Files"** ou **"Arquivos"**
2. Crie um arquivo chamado `nginx.conf` com o conteúdo abaixo:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }

    upstream backend {
        server backend:3001;
    }

    server {
        listen 80;
        server_name _;

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
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

---

### Passo 6: Configurar Portas e Domínios

1. **Portas**:
   - Clique em **"Ports"** ou **"Portas"**
   - Mapeie: **80** (porta pública) → **nginx** (serviço) → **80** (porta interna)

2. **Domínios** (se usar domínios customizados):
   - Clique em **"Domains"** ou **"Domínios"**
   - Adicione:
     - `copy.dparente.site` → frontend
     - `copys.dparente.site` → backend
   - Configure DNS CNAME ou A record apontando para seu servidor Coolify

---

### Passo 7: Deploy

1. Clique em **"Deploy"** ou **"Implantar"**
2. Aguarde o build completar (⏱️ 3-5 minutos)
3. Verifique os logs em **"Logs"** ou **"Registros"**

---

## ✅ Após Deploy

### Verificar se tudo funcionou

```bash
# No seu servidor Coolify, execute:
docker-compose ps

# Esperado (todos saudáveis):
# raiar-postgres   Up     (healthy)
# raiar-backend    Up     (healthy)
# raiar-frontend   Up     (healthy)
# raiar-nginx      Up
```

### Acessar a aplicação

- **Frontend**: http://copy.dparente.site/
- **Backend API**: http://copys.dparente.site/api
- **Login padrão**:
  - Email: `admin@admin.com`
  - Senha: `admin`

---

## 🔍 Troubleshooting

### "Build falhou"
```bash
# Verifique os logs
docker-compose logs backend
docker-compose logs frontend

# Se houver erro de git, verifique se a URL está correta:
# https://github.com/deividparente/copysaas.git#main
```

### "Database não conecta"
```bash
docker-compose logs postgres

# Verifique se DB_PASSWORD está correto nas variáveis
```

### "Nginx retorna 502"
```bash
docker-compose logs nginx

# Aguarde até que frontend e backend estejam healthy
docker-compose ps
```

### "Frontend não carrega"
```bash
# Verifique NEXT_PUBLIC_API_URL
docker-compose logs frontend

# Deve ser: http://copys.dparente.site/api
```

---

## 🔐 Segurança (HTTPS)

Se quiser HTTPS com Let's Encrypt (recomendado para produção):

1. No Coolify, vá em **"SSL"** ou **"Certificados"**
2. Selecione **"Let's Encrypt"**
3. Coolify gerenciará renovação automáticamente

Atualize o `nginx.conf` para HTTPS:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }

    upstream backend {
        server backend:3001;
    }

    # Redirect HTTP → HTTPS
    server {
        listen 80;
        server_name _;
        return 301 https://$host$request_uri;
    }

    # HTTPS
    server {
        listen 443 ssl http2;
        server_name _;

        ssl_certificate /etc/letsencrypt/live/copy.dparente.site/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/copy.dparente.site/privkey.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

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

## 📊 Monitoramento

### Ver logs em tempo real
```bash
docker-compose logs -f

# Serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Reiniciar serviços
```bash
docker-compose restart

# Serviço específico
docker-compose restart backend
```

### Parar tudo
```bash
docker-compose down     # Para containers (mantém dados)
docker-compose down -v  # Remove também volumes
```

---

## 📞 Suporte

- Dúvidas sobre Coolify: https://coolify.io/docs
- Dúvidas sobre o projeto: https://github.com/deividparente/copysaas

---

## ✨ Resumo

| Item | Valor |
|------|-------|
| Repository | https://github.com/deividparente/copysaas |
| Frontend URL | http://copy.dparente.site |
| Backend URL | http://copys.dparente.site |
| Database | PostgreSQL 16 |
| Web Server | Nginx |
| Login padrão | admin@admin.com / admin |
| Node Env | production |

Pronto para produção! 🚀

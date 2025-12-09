# 🚀 Guia de Deploy no Coolify

## Pré-requisitos
- Coolify instalado e rodando
- Git repository (GitHub, GitLab, etc.)
- Domínios configurados (frontend e backend)

---

## 📋 Passo 1: Preparar Variáveis de Ambiente

### 1.1 Gerar chaves seguras

```bash
# Gere uma senha para PostgreSQL
openssl rand -hex 16

# Gere uma chave JWT
openssl rand -hex 32
```

### 1.2 Copiar `.env.example` para `.env.production`

```bash
cp .env.example .env.production
```

### 1.3 Preencher variáveis no Coolify

No painel do Coolify, defina as seguintes variáveis de ambiente:

```env
# Database
DB_PASSWORD=<sua-senha-gerada-acima>

# JWT
JWT_SECRET=<sua-chave-jwt-gerada-acima>

# URLs (substitua pelos seus domínios)
FRONTEND_URL=http://copy.dparente.site/
BACKEND_URL=http://copys.dparente.site/

# Node Environment
NODE_ENV=production
```

---

## 🐳 Passo 2: Configurar no Coolify

### 2.1 Adicionar repositório
1. No Coolify, clique em **"Adicionar Projeto"**
2. Selecione seu repositório Git (GitHub/GitLab)
3. Branch: `main`
4. Root path: `/` (ou deixe em branco)

### 2.2 Configurar Serviços
1. **Compose file**: Selecione `docker-compose.yml` (padrão)
2. **Services a rodar**: 
   - ✅ postgres
   - ✅ backend
   - ✅ frontend
   - ✅ nginx

### 2.3 Configurar portas

No Coolify, **mapeie a porta 80 para o Nginx**:
- **Port**: 80 (porta pública)
- **Service**: nginx
- **Container Port**: 80

### 2.4 Adicionar domínios customizados (opcional)

Se usar domínios próprios (ao invés de subdomínios do Coolify):
1. Vá para **Settings → Domains**
2. Adicione seus domínios
3. Configure DNS CNAME ou A record apontando para seu servidor Coolify

---

## 🔄 Passo 3: Deploy

### 3.1 Ativar auto-deploy

1. No Coolify, ative **"Auto Deploy"**
2. Toda vez que fizer `git push origin main`, o deploy será automático

### 3.2 Deploy manual

```bash
# Push para main
git push origin main

# No Coolify, clique em "Deploy" ou aguarde auto-deploy
```

### 3.3 Verificar status

```bash
# Ver logs dos containers
docker-compose logs -f

# Verificar health dos serviços
docker-compose ps
```

---

## ✅ Checklist Pós-Deploy

- [ ] PostgreSQL está rodando e acessível
- [ ] Backend está saudável (`/health` retorna 200)
- [ ] Frontend carregou e conectou ao backend
- [ ] Nginx está proxy-fazendo corretamente
- [ ] Domínios frontend e backend funcionam
- [ ] Cookies JWT estão sendo salvos
- [ ] Database migrations foram aplicadas

---

## 🔧 Troubleshooting

### "Database connection refused"
```bash
# Aguarde PostgreSQL iniciar (health check: 10s)
docker-compose logs postgres
```

### "Backend não conecta ao database"
```bash
# Verifique DB_PASSWORD no Coolify
docker-compose logs backend

# Teste conexão manualmente
docker-compose exec postgres psql -U raiar -d raiar_mensagens
```

### "Frontend não carrega API"
```bash
# Verifique se NEXT_PUBLIC_API_URL está correto
docker-compose logs frontend

# Teste acesso ao backend
curl http://copys.dparente.site/api/health
```

### "Seed do database não rodou"
```bash
# Seed agora é rodado uma única vez no primeiro deploy
# Para re-seed, execute manualmente:
docker-compose exec backend npx prisma db seed
```

### "Nginx retorna 502 Bad Gateway"
```bash
# Certifique-se de que frontend e backend estão healthy
docker-compose ps

# Verifique logs do nginx
docker-compose logs nginx

# Teste acesso direto aos serviços
curl http://frontend:3000
curl http://backend:3001/health
```

---

## 📊 Monitoramento

### Logs em tempo real
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Estatísticas de recurso
```bash
docker stats
```

### Verificar volumes
```bash
docker volume ls
docker volume inspect raiar_mensagens_postgres_data
```

---

## 🔐 Segurança

- ✅ Senhas geradas com `openssl rand -hex`
- ✅ `NODE_ENV=production` em todas as instâncias
- ✅ Cookies JWT com `httpOnly: true`, `secure: true`
- ✅ CORS configurado apenas para domínios autorizados
- ✅ PostgreSQL não exposto publicamente (apenas backend acessa)

---

## 🚨 Em caso de problemas

1. **Verifique as variáveis de ambiente** no Coolify
2. **Revise os logs** de cada container
3. **Teste conectividade** entre serviços
4. **Confirme que porta 80 está disponível**
5. **Reinicie os containers** se necessário

```bash
docker-compose restart
```

---

## 📞 Suporte

Para dúvidas sobre Coolify, consulte:
- [Documentação Coolify](https://coolify.io/docs)
- [GitHub Coolify](https://github.com/coollabsio/coolify)

Para dúvidas sobre o projeto, revise:
- `COMECO_AQUI.md`
- `README.md`
- `QUICK_START.md`

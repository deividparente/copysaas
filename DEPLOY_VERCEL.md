# 🚀 Deploy Automático no Vercel

## Deploy em 1 Clique

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/seu-usuario/raiar-mensagens)

### Passos:

1. **Clique no botão acima**
2. **Conecte seu GitHub**
3. **Clique em "Deploy"**

**Pronto! Aguarde 2-3 minutos e seu sistema estará no ar! 🎉**

---

## O que acontece automaticamente?

✅ Vercel detecta Next.js  
✅ Instala todas as dependências  
✅ Cria banco de dados SQLite  
✅ Roda migrações do Prisma  
✅ Popula dados iniciais  
✅ Faz build otimizado  
✅ Deploy com SSL automático  

---

## Primeiro Acesso

Após o deploy, acesse a URL fornecida pelo Vercel:

**Credenciais padrão:**
- Email: `admin@raiar.com`
- Senha: `Raiar@2026`

> 🔒 **Importante:** Mude a senha após o primeiro login!

---

## Personalização

### 1. Domínio Customizado

1. No painel do Vercel: **Settings** → **Domains**
2. Adicione seu domínio
3. Configure DNS conforme instruções
4. SSL automático!

### 2. Branding

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

FROM node:20-alpine AS builder

WORKDIR /app

# Copiar apenas package.json first (para cache layer)
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar resto dos arquivos
COPY . .

# Criar .env.production para build
RUN echo "NEXT_PUBLIC_API_URL=/api" > .env.production

# Build Next.js
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copiar apenas o necessário para produção
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package*.json ./

EXPOSE 3000

CMD ["node", "server.js"]

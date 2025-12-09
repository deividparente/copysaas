FROM node:20-alpine

WORKDIR /app

# Copiar package files primeiro
COPY package*.json ./

# Instalar dependências (sem prisma gerado ainda)
RUN npm install --production

# Copiar código restante

# Copiar restante do código
COPY . .

# Criar .env temporário para build do Prisma
RUN echo "DATABASE_URL=file:./dev.db" > .env

# Gerar Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Remover .env (será fornecido em runtime)
# Remover .env (será fornecido em runtime)
RUN rm -f .env

# Copiar entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expor porta
EXPOSE 3001

# Start via entrypoint (aplica migrations/seed em runtime)
ENTRYPOINT ["/entrypoint.sh"]

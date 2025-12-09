FROM node:20-alpine

WORKDIR /app

# Copiar todos os arquivos
COPY . .

# Instalar dependências
RUN npm ci --only=production

# Gerar Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Expor porta
EXPOSE 3001

# Start
CMD ["npm", "start"]

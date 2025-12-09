FROM node:18-alpine

WORKDIR /app/backend

# Instalar dependências
COPY backend/package*.json ./
RUN npm install

# Copiar código
COPY backend . 
COPY backend/.env* ./

# Gerar Prisma Client
RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "run", "dev"]

FROM node:18-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Instalar dependências
RUN npm install
RUN cd backend && npm install
RUN cd frontend && npm install

# Copiar código
COPY . .

# Gerar Prisma Client
RUN cd backend && npx prisma generate

# Build frontend
RUN cd frontend && npm run build

# Expor portas
EXPOSE 3000 3001

# Script de inicialização
CMD ["npm", "run", "dev"]

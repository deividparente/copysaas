FROM node:18-alpine as builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend .

RUN npm run build

FROM node:18-alpine

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install --only=production

COPY --from=builder /app/frontend/.next ./.next
COPY --from=builder /app/frontend/public ./public
COPY --from=builder /app/frontend/app ./app

EXPOSE 3000

CMD ["npm", "start"]

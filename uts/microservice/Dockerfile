FROM node:current-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
# CMD akan di-override oleh docker-compose 'command'
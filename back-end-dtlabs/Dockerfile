FROM node:20

# Cria diretório da aplicação
WORKDIR /app

# Copia package.json e pnpm-lock
COPY package.json pnpm-lock.yaml ./

# Instala pnpm
RUN npm install -g pnpm

# Instala dependências
RUN pnpm install

# Copia o restante do código
COPY . .

# Expõe porta do NestJS
EXPOSE 3000

# Comando para rodar o backend
CMD ["pnpm", "run", "start:dev"]
# CMD ["pnpm", "run", "start:prod"]

# 🚀 Projeto Monitoramento em Tempo Real

Este projeto é composto por um **Backend** (NestJS + Prisma) e um **Frontend** (React + Vite), com suporte a **notificações em tempo real via WebSocket**.  

Ele permite:  
- Criar usuários  
- Registrar dispositivos  
- Gerar heartbeats simulados  
- Receber notificações em tempo real quando métricas ultrapassam limites configurados  

---
### 1. Clone o repositório
```bash
git clone git@github.com:LailtonXavier/exame-fullstack-setembro-dtlabs-2025.git
cd exame-fullstack-setembro-dtlabs-2025
```

## 🛠️ Tecnologias

### Backend
- **NestJS** com **Clean Architecture**  
- **Prisma ORM** + **PostgreSQL**  
- **JWT** para autenticação  
- **Zod** para validação de dados  
- **Socket.IO** para WebSockets (tempo real)  
- **Testes**: Unitários, E2E e de Integração  
- **Docker** para ambiente isolado  

### Frontend
- **React + Vite**  
- **Zustand** para gerenciamento de estado global  
- **React Query** para requisições e cache  
- **React Hook Form** + **Zod** para formulários validados  
- **Socket.IO Client** para notificações em tempo real  
- **Sonner** para toasts de feedback  
- **Styled-components** para estilização  
- **Clean Architecture** na estrutura do projeto  

### Simulator
- Script em Node.js que gera heartbeats aleatórios  
- Faz login com usuário real  
- Envia métricas para dispositivos cadastrados  

---

## ⚙️ Como Rodar o Projeto

### 2. Configure os arquivos `.env`
Em cada pasta (`backend`, `frontend`, `simulator`) existe um arquivo **`.env.example`**.  
Renomeie para **`.env`** e ajuste as variáveis necessárias.

---

### 3. Subindo o Banco de Dados e a API
```bash
docker-compose up postgres --build
docker-compose up backend --build
```

### 3. Subindo o Front

```bash
cd front-end-dtlabs
npm install
npm run dev
```

O frontend estará rodando em:
http://localhost:5173

1. Criando Usuário e Dispositivo

2. Cadastre um usuário no frontend

3. Registre um dispositivo

   

Agora esta pronto pra rodar o simulator:

### 4. Rodar o simular
```bash
docker-compose up simulator --build
```

ATENÇÃO: adicione no `.env` as credenciais de acesso corretas, as que você criou a conta do usuario.

### Bonus
Depois de tudo configurados, usuario feito, dispositivo criado, voce usar um unico comando para rodas o projeto todo:

```bash
docker-compose up --build
```


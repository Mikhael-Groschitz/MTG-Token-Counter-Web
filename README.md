# ⚔️ TokenForge — Web

> Companion app para Magic: The Gathering focado em contador de tokens de mesa.

TokenForge é um projeto de fã, não oficial, que permite criar tokens personalizados, gerenciar quantidades durante partidas e salvar modelos na sua conta para usar em qualquer dispositivo.

---

## ✨ Funcionalidades

- 🎮 **Mesa de Jogo** — adicione tokens, ajuste contadores em tempo real e gerencie o battlefield
- 🔓 **Modo Anônimo** — crie tokens ilimitados salvos no cache do navegador, sem necessidade de conta
- 👤 **Modo Logado** — salve até 5 modelos de tokens na sua conta e acesse de qualquer navegador
- 🃏 **Tokens Customizados** — defina nome, tipo, cor, poder/resistência, habilidades e imagem
- 🖼️ **Upload de Imagem** — envie sua própria arte ou use uma URL externa
- 🎨 **Dois layouts de card** — Clássico e Full Art
- 🔐 **Autenticação** — login com email/senha ou Google OAuth

---

## 🛠️ Stack

| Tecnologia | Uso |
|---|---|
| React 18 + TypeScript | Framework principal |
| Vite | Build e dev server |
| Tailwind CSS | Estilização |
| React Router v6 | Roteamento |
| Axios | Chamadas à API |
| Motion (Framer Motion) | Animações |
| GSAP | Animação do menu de navegação |
| Lucide React | Ícones |
| @react-oauth/google | Autenticação com Google |

---

## 🚀 Como rodar localmente

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/tokenforge-web.git
cd tokenforge-web

# Instale as dependências
npm install
```

### Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```bash
cp .env.example .env
```

Preencha as variáveis:

```env
VITE_API_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=seu_google_client_id
```

> ⚠️ O arquivo `.env` **não deve ser commitado**. Ele já está no `.gitignore`.

### Rodando em desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

### Build de produção

```bash
npm run build
```

Os arquivos gerados estarão na pasta `dist/`.

---

## 📁 Estrutura do projeto

```
src/
├── components/
│   ├── ui/
│   │   ├── BugReportForm.tsx
│   │   ├── CardNav.tsx
│   │   └── AnimatedList.tsx
│   └── Layout.tsx
├── context/
│   └── AuthContext.tsx
├── features/
│   └── battlefield/
│       └── components/
│           ├── TokenCard.tsx
│           ├── TokenModal.tsx
│           ├── TokenGallery.tsx
│           └── LibraryPickModal.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useTokens.ts
├── lib/
│   └── utils.ts
├── pages/
│   ├── GamePage.tsx
│   ├── DashboardPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ForgotPasswordPage.tsx
│   ├── VerifyEmailPage.tsx
│   ├── SupportPage.tsx
│   └── BugReportPage.tsx
├── services/
│   ├── api.ts
│   ├── authService.ts
│   └── tokenService.ts
└── types/
    └── index.ts
```

---

## 🗺️ Rotas

| Rota | Página |
|---|---|
| `/` | Mesa de Jogo |
| `/login` | Login |
| `/register` | Cadastro |
| `/forgot-password` | Recuperar Senha |
| `/verify-email` | Verificação de Email |
| `/dashboard` | Biblioteca de Tokens |
| `/support` | Como Apoiar |
| `/bugreport` | Reportar Bug |

---

## ⚖️ Aviso Legal

TokenForge é um conteúdo de fã não oficial, permitido pela Política de Conteúdo de Fãs da Wizards of the Coast. Este projeto não é aprovado ou endossado pela Wizards of the Coast. Magic: The Gathering e todas as suas marcas são propriedade da **Wizards of the Coast LLC**.

---

## 🔒 Acesso ao Backend

Este repositório contém apenas o código do frontend. O backend (API Java/Spring Boot) é mantido em repositório privado.

Para solicitar acesso ao backend, entre em contato através das **Issues** deste repositório ou envie uma mensagem diretamente ao mantenedor do projeto.

> Contribuidores que desejam colaborar com o frontend não precisam de acesso ao backend — basta apontar o `VITE_API_URL` para a instância pública da API quando disponível.

# ⚔️ TokenForge — Web

> Companion app para Magic: The Gathering focado em contador de tokens de mesa.

TokenForge é um projeto de fã, não oficial, que permite criar tokens personalizados, gerenciar quantidades durante partidas e salvar modelos na sua conta para usar em qualquer dispositivo.

---

## ✨ Funcionalidades

- 🎮 **Mesa de Jogo** — adicione tokens, ajuste contadores em tempo real e gerencie o battlefield
- 🔓 **Modo Anônimo** — crie tokens ilimitados salvos no cache do navegador, sem necessidade de conta
- 👤 **Modo Logado** — salve até 5 modelos de tokens na sua conta e acesse de qualquer navegador
- 🃏 **Tokens Customizados** — defina nome, tipo, cor, poder/resistência, habilidades e imagem
- 🔍 **Busca via Scryfall** — pesquise tokens oficiais direto da API do Scryfall e importe arte e atributos automaticamente
- 🖼️ **Upload de Imagem** — envie sua própria arte como alternativa à busca no Scryfall
- 🎨 **Dois layouts de card** — Clássico e Full Art
- ➕ **Contadores de Poder/Vida e Palavra-chave** — ajuste +1/+1, -1/-1 e marcadores de habilidades (voar, atropelar, etc.) direto no card, com botão de reset rápido
- 🔐 **Autenticação** — login com email/senha ou Google OAuth
- 📄 **Páginas institucionais** — Landing Page, Termos de Uso, Política de Privacidade e formulário de Bug Report
- 🔎 **SEO** — meta tags dinâmicas via `react-helmet-async`, middleware de pre-rendering para bots/crawlers, `sitemap.xml` e `robots.txt`
- 📱 **PWA** — instalável, com manifest e ícones adaptativos

---

## 🛠️ Stack

| Tecnologia | Uso |
|---|---|
| React 18 + TypeScript | Framework principal |
| Vite | Build e dev server |
| Tailwind CSS | Estilização |
| React Router v7 | Roteamento |
| Axios | Chamadas à API |
| Motion (Framer Motion) | Animações |
| GSAP | Animação do menu de navegação |
| Lucide React | Ícones |
| @react-oauth/google | Autenticação com Google |
| react-helmet-async | Meta tags e SEO |
| vite-plugin-pwa | PWA (manifest, service worker) |
| @vercel/analytics | Analytics |
| Scryfall API | Busca de dados e imagens de tokens oficiais |

---

## 🚀 Como rodar localmente

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Mikhael-Groschitz/MTG-Token-Counter-Web.git
cd MTG-Token-Counter-Web

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
│   │   └── CardNav.tsx
│   ├── AnimatedList.tsx
│   ├── Layout.tsx
│   └──  ProtectedRoute.tsx
├── context/
│   └── AuthContext.tsx
├── features/
│   └── battlefield/
│       ├── components/
│       │   ├── TokenCard.tsx
│       │   ├── TokenModal.tsx
│       │   ├── TokenGallery.tsx
│       │   ├── TokenCountersModal.tsx
│       │   ├── ScryfallTokenSearch.tsx
│       │   └── LibraryPickModal.tsx
│       ├── constants/
│       │   ├── colorIdentities.ts
│       │   └── counters.ts
│       └── utils/
│           ├── counters.ts
│           └── renderManaText.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useTokens.ts
│   └── useManaSymbols.ts
├── lib/
│   └── utils.ts
├── pages/
│   ├── LandingPage.tsx
│   ├── GamePage.tsx
│   ├── DashboardPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ForgotPasswordPage.tsx
│   ├── ResetPasswordPage.tsx
│   ├── VerifyEmailPage.tsx
│   ├── SupportPage.tsx
│   ├── BugReportPage.tsx
│   ├── PrivacyPolicyPage.tsx
│   └── TermsOfServicePage.tsx
├── services/
│   ├── api.ts
│   ├── authService.ts
│   ├── tokenService.ts
│   ├── bugReportService.ts
│   ├── scryfallService.ts
│   └── scryfallSymbologyService.ts
└── types/
    └── index.ts
```

Na raiz do projeto, `middleware.ts` roda como Edge Function (Vercel) e serve HTML com meta tags pré-renderizadas para bots/crawlers de redes sociais.

---

## 🗺️ Rotas

| Rota | Página |
|---|---|
| `/` | Landing Page |
| `/jogar` | Mesa de Jogo |
| `/entrar` | Login |
| `/cadastro` | Cadastro |
| `/esqueci-senha` | Recuperar Senha |
| `/redefinir-senha` | Redefinir Senha |
| `/verificar-email` | Verificação de Email |
| `/painel` | Biblioteca de Tokens (rota protegida) |
| `/apoiar` | Como Apoiar |
| `/reportar-bug` | Reportar Bug |
| `/politica-de-privacidade` | Política de Privacidade |
| `/termos-de-uso` | Termos de Uso |

---

## ⚖️ Aviso Legal

TokenForge é um conteúdo de fã não oficial, permitido pela Política de Conteúdo de Fãs da Wizards of the Coast. Este projeto não é aprovado ou endossado pela Wizards of the Coast. Magic: The Gathering e todas as suas marcas são propriedade da **Wizards of the Coast LLC**.

---

## 🔒 Acesso ao Backend

Este repositório contém apenas o código do frontend. O backend (API Java/Spring Boot) é mantido em repositório público separado.

É possível enviar uma pull request para o backend  ou envie uma mensagem diretamente ao mantenedor do projeto.

> Contribuidores que desejam colaborar com o frontend não precisam de acesso ao backend — basta apontar o `VITE_API_URL` para a instância pública da API quando disponível.

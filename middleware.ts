// Vercel Routing Middleware: WhatsApp/Facebook/Twitter/etc. link-preview
// crawlers don't execute JavaScript, so the per-route <title>/og:*/twitter:*
// tags set client-side by react-helmet-async (src/components/SEO.tsx) are
// invisible to them — they only ever see the single static index.html.
// This middleware intercepts *only* requests from those known bots on the
// public indexable routes and swaps the relevant tags for route-specific
// values before returning the HTML. Everyone else (real users, unmapped
// routes, static assets) passes through untouched.
//
// Keep ROUTES below in sync with the title/description props passed to
// <SEO ... /> in src/pages/*.tsx — this is intentionally duplicated rather
// than imported from src/, since this file is bundled separately by Vercel
// for the Edge runtime and importing the Vite app's source tree here would
// risk pulling in browser-only code into that bundle.

export const config = {
    runtime: 'edge',
    matcher: ['/', '/jogar', '/apoiar', '/politica-de-privacidade', '/termos-de-uso'],
};

const BOT_USER_AGENT =
    /facebookexternalhit|Twitterbot|WhatsApp|LinkedInBot|Slackbot(?:-LinkExpanding)?|TelegramBot|Discordbot|Pinterest|redditbot|Applebot/i;

const ROUTES: Record<string, { title: string; description: string }> = {
    '/': {
        title: 'TokenForge — Crie e Controle Tokens de Magic: The Gathering',
        description:
            'Chega de improvisar com dados e moedas. Crie tokens personalizados e controle a quantidade em campo em tempo real, direto do navegador — grátis.',
    },
    '/jogar': {
        title: 'Mesa de Jogo | TokenForge',
        description: 'Controle a quantidade dos seus tokens de Magic: The Gathering em tempo real, direto do navegador.',
    },
    '/apoiar': {
        title: 'Como Apoiar o Projeto | TokenForge',
        description: 'Saiba como apoiar o desenvolvimento do TokenForge, um projeto de fã gratuito para Magic: The Gathering.',
    },
    '/politica-de-privacidade': {
        title: 'Política de Privacidade | TokenForge',
        description: 'Entenda como o TokenForge trata seus dados pessoais.',
    },
    '/termos-de-uso': {
        title: 'Termos de Uso | TokenForge',
        description: 'Confira os termos de uso do TokenForge.',
    },
};

export default async function middleware(request: Request) {
    const userAgent = request.headers.get('user-agent') ?? '';
    const { pathname, origin } = new URL(request.url);
    const route = ROUTES[pathname];

    if (!route || !BOT_USER_AGENT.test(userAgent)) {
        return;
    }

    const response = await fetch(`${origin}/index.html`);
    let html = await response.text();

    const url = `${origin}${pathname}`;
    const { title, description } = route;

    html = html
        .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
        .replace(/(<meta name="description" content=")[^"]*(")/, `$1${description}$2`)
        .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
        .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`)
        .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${description}$2`)
        .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
        .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${title}$2`)
        .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${description}$2`);

    return new Response(html, {
        headers: { 'content-type': 'text/html; charset=utf-8' },
    });
}

import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://www.theforgeoftokens.com';

// These og:*/twitter:*/title overrides only affect JS-executing crawlers
// (Google, browser tabs) — WhatsApp's link-preview bot doesn't run JS, so it
// never sees them. That case is handled separately, at the edge, by
// middleware.ts (which swaps the static index.html's tags for known bot user
// agents on these same routes). Keep title/description here in sync with the
// ROUTES map in middleware.ts.
interface SEOProps {
    title: string;
    description: string;
    path: string;
    noindex?: boolean;
}

export const SEO = ({ title, description, path, noindex = false }: SEOProps) => {
    const fullTitle = `${title} | TokenForge`;
    const url = `${SITE_URL}${path}`;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />
            <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow'} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
        </Helmet>
    );
};

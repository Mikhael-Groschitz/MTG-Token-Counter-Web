import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://www.theforgeoftokens.com';

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

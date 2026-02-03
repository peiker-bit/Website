import React from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const SEO = ({ title, description, keywords, image, url, type = 'website' }) => {
    const siteTitle = 'Peiker Steuerberatung';
    const defaultDescription = 'Ihre vertrauenswürdige Steuerberatung für Privatpersonen und Unternehmen. Digitale Zusammenarbeit, Lohnbuchhaltung und individuelle Beratung.';
    const defaultKeywords = 'Steuerberater, Steuerberatung, Lohnbuchhaltung, Einkommensteuer, Buchführung, Digitale Zusammenarbeit, DATEV';
    const domain = 'https://peiker-steuer.de';

    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const metaDescription = description || defaultDescription;
    const metaKeywords = keywords || defaultKeywords;
    const metaImage = image ? `${domain}${image}` : `${domain}/og-image.jpg`; // Ensure you have an og-image.jpg or change this
    const metaUrl = url ? `${domain}${url}` : domain;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={metaUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:url" content={metaUrl} />
            <meta property="og:site_name" content={siteTitle} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />
        </Helmet>
    );
};

SEO.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    keywords: PropTypes.string,
    image: PropTypes.string,
    url: PropTypes.string,
    type: PropTypes.string,
};

export default SEO;

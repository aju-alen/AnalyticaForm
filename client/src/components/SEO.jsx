import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({
  title,
  description,
  ogTitle,
  ogDescription,
  keywords,
  canonicalUrl,
  name,
  type,
  schema,
  surveyImage,
  surveyUrl,
  robotText,
}) {
  const resolvedOgTitle = ogTitle ?? title;
  const resolvedOgDescription = ogDescription ?? description;
  const resolvedCanonicalUrl = canonicalUrl ?? surveyUrl;
  const resolvedOgUrl = surveyUrl ?? canonicalUrl;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="robots" content={robotText || 'index, follow'} />
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {resolvedCanonicalUrl && <link rel="canonical" href={resolvedCanonicalUrl} />}

      <meta property="og:site_name" content={name} />
      {type && <meta property="og:type" content={type} />}
      {resolvedOgTitle && <meta property="og:title" content={resolvedOgTitle} />}
      {resolvedOgDescription && <meta property="og:description" content={resolvedOgDescription} />}
      {surveyImage && <meta property="og:image" content={surveyImage} />}
      {resolvedOgUrl && <meta property="og:url" content={resolvedOgUrl} />}

      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content={surveyImage ? 'summary_large_image' : 'summary'} />
      {resolvedOgTitle && <meta name="twitter:title" content={resolvedOgTitle} />}
      {resolvedOgDescription && <meta name="twitter:description" content={resolvedOgDescription} />}
      {surveyImage && <meta name="twitter:image" content={surveyImage} />}

      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}

import React from 'react';
import { Helmet } from 'react-helmet-async';
export default function SEO({title, description, name, type,schema,surveyImage,surveyUrl,robotText}) {
return (
<Helmet>
{ /* Standard metadata tags */ }
<title>{title}</title>
<meta name='robots' content={robotText || 'index, follow'} />
<meta name='description' content={description} />
{ /* End standard metadata tags */ }
{ /* Facebook tags */ }
<meta property="og:site_name" content={name} />
<meta property="og:type" content={type} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={surveyImage} />
<meta property="og:url" content={surveyUrl} />
{ /* End Facebook tags */ }
{ /* Twitter tags */ }
<meta name="twitter:creator" content={name} />
<meta name="twitter:card" content={type} />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={surveyImage} />
{ /* End Twitter tags */ }
{schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
</Helmet>
)
}
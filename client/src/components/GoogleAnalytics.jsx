// src/components/GoogleAnalytics.jsx
import { useEffect } from 'react';

const GoogleAnalytics = () => {
  useEffect(() => {
    // Check if the script is already loaded
    if (window.gtag) return;

    // Create the first script (gtag.js)
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-V1K1K7E27L';

    // Create the second script (configuration)
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-V1K1K7E27L');
    `;

    // Add scripts to document head
    document.head.appendChild(script1);
    document.head.appendChild(script2);

    // Cleanup function
    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []); // Empty dependency array means this runs once on mount

  return null;
};

export default GoogleAnalytics;
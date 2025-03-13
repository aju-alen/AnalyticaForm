import React, { useEffect } from 'react';

const TestPage = () => {
  useEffect(() => {
    // Make the GET request to the backend API
    fetch(`https://backend.dubaianalytica.com/survey-meta/cm82wzqdc000379zm5rj1g29c`)
      .then((response) => response.text())
      .then((html) => {
        // Extract the redirect URL from the meta refresh tag
        const match = html.match(/content="0;url=([^"]+)"/);
        if (match && match[1]) {
          window.location.href = match[1];
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <p>Loading...</p>
    </div>
  );
};

export default TestPage;

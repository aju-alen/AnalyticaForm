import React, { useEffect } from 'react';

const TestPage = () => {
  useEffect(() => {
    // Make the GET request to the backend API
    fetch(`https://backend.dubaianalytica.com/survey-meta/cm82wzqdc000379zm5rj1g29c`)
      .then((response) => {
        // The backend will handle the redirect, so we don't need to process the response
        console.log('Request sent to backend');
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

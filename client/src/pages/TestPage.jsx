import React, { useEffect } from 'react';

const TestPage = () => {
  useEffect(() => {
    // Make the GET request to the backend API
    fetch(`https://backend.dubaianalytica.com/survey-meta/cm82wzqdc000379zm5rj1g29c`)
      .then((response) => response.json())
      .then((data) => {
        // You can perform any necessary actions with the data here
        console.log(data);

        // Redirect to another URL after the API call
        window.location.href = `https://dubaianalytica.com/user-survey/cm82wzqdc000379zm5rj1g29c`;
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

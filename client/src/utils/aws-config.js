// aws-config.js
import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: import.meta.env.VITE_ACCESS_KEY,
  secretAccessKey: import.meta.env.VITE_SECRET_KEY,
  region: import.meta.env.VITE_REGION,
});

const rekognition = new AWS.Rekognition();



export default rekognition;

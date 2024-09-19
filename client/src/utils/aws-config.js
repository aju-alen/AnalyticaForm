// aws-config.js
import AWS from 'aws-sdk';

import { Rekognition } from '@aws-sdk/client-rekognition';

// JS SDK v3 does not support global configuration.
// Codemod has attempted to pass values to each service client in this file.
// You may need to update clients outside of this file, if they use global config.
// JS SDK v3 does not support global configuration.
// Codemod has attempted to pass values to each service client in this file.
// You may need to update clients outside of this file, if they use global config.
AWS.config.update({
  accessKeyId: import.meta.env.VITE_ACCESS_KEY,
  secretAccessKey: import.meta.env.VITE_SECRET_KEY,
  region: import.meta.env.VITE_REGION,
});

const rekognition = new Rekognition({
  credentials: {
    accessKeyId: import.meta.env.VITE_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_SECRET_KEY,
  },

  region: import.meta.env.VITE_REGION,
});



export default rekognition;

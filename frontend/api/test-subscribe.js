import { config } from 'dotenv';
config(); // Load variables from .env if present

import handler from './subscribe.js';

const req = {
  method: 'POST',
  body: { email: 'test-local@streamusique.com' }
};

const res = {
  status: (code) => {
    console.log(`Status: ${code}`);
    return {
      json: (data) => console.log('Response:', data)
    };
  }
};

handler(req, res).catch(console.error);

import http from 'http';
import handler from './subscribe.js';

const server = http.createServer(async (req, res) => {
  // Mock Express-like req/res for Vercel
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    try {
      req.body = JSON.parse(body || '{}');
    } catch (e) {
      req.body = {};
    }
    
    res.status = (code) => {
      res.statusCode = code;
      return {
        json: (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        }
      };
    };
    
    await handler(req, res);
  });
});

server.listen(3000, () => {
  console.log('Test server listening on 3000');
});

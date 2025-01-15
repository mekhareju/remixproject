import express from 'express';
import { createRequestHandler } from '@remix-run/express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.resolve(__dirname, 'public')));

// Handle requests with Remix
app.all(
  '*',
  createRequestHandler({
    build: await import('./build/index.js'),
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express server is running at http://localhost:${PORT}`);
});

import express from 'express';
import path from 'path';

const app = express();
const ROOT = path.resolve(__dirname, '..', '..');

// Serve static files with correct MIME types
app.use(express.static(ROOT, {
  extensions: ['html'],
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Firebase-style rewrites
app.get('/app', (_req, res) => {
  res.sendFile(path.join(ROOT, 'app.html'));
});

app.get('/app.html', (_req, res) => {
  res.sendFile(path.join(ROOT, 'app.html'));
});

// Catch-all → index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(ROOT, 'index.html'));
});

const PORT = process.env.PORT || 3847;
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});

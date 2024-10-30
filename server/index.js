import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';
import multer from 'multer';
import pdf from 'pdf-parse';
import fs from 'fs';
import { db } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(join(__dirname, '../dist')));

// Create uploads directory if it doesn't exist
const uploadsDir = join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// File upload configuration
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// API Routes
app.post('/api/agents', async (req, res) => {
  try {
    const { id, name, prompt, model } = req.body;
    await db.run(
      'INSERT OR REPLACE INTO agents (id, name, prompt, model) VALUES (?, ?, ?, ?)',
      [id, name, prompt, model]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/agents', async (req, res) => {
  try {
    const agents = await db.all('SELECT * FROM agents ORDER BY created_at DESC');
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/agents/:id', async (req, res) => {
  try {
    await db.run('DELETE FROM agents WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { agentId, message } = req.body;
    const agent = await db.get('SELECT * FROM agents WHERE id = ?', [agentId]);
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Query Ollama
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: agent.model,
        prompt: `${agent.prompt}\n\nUser: ${message}\nAssistant:`,
        stream: false
      })
    });

    const data = await response.json();
    res.json({ response: data.response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/knowledge', upload.single('file'), async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let content = '';

    if (file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(file.path);
      const data = await pdf(dataBuffer);
      content = data.text;
    } else {
      content = fs.readFileSync(file.path, 'utf8');
    }

    await db.run(
      'INSERT INTO knowledge (id, name, content, type) VALUES (?, ?, ?, ?)',
      [Date.now().toString(), file.originalname, content, file.mimetype]
    );

    fs.unlinkSync(file.path); // Clean up uploaded file
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/knowledge', async (req, res) => {
  try {
    const knowledge = await db.all('SELECT id, name, type, created_at FROM knowledge ORDER BY created_at DESC');
    res.json(knowledge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// All other routes serve the index.html
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

const server = createServer(app);

server.listen(port, () => {
  console.log(`AI Framework running at http://localhost:${port}`);
});
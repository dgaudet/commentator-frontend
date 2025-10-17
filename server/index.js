const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ 
    message: 'Hello from the server!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/greet/:name', (req, res) => {
  const { name } = req.params;
  res.json({ 
    message: `Hello, ${name}!`,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'up',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// server.ts
import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app = express();
app.use(express.json());

app.post('/api/embed', async (req, res) => {
  const { input } = req.body;

  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input
    });

    res.json(response.data[0].embedding);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch embedding" });
  }
});

app.listen(3000, () => console.log('API running on port 3000'));

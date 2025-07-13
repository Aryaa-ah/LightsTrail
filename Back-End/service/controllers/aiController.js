import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const apiKey = process.env.OPENROUTER_API_KEY;
const apiUrl = 'https://openrouter.ai/api/v1/chat/completions';

router.post('/chat', async (req, res) => {
  try {
    const { messages, location } = req.body;
    const locationPrompt = location
      ? ` The user is at latitude ${location.lat} and longitude ${location.lon}.`
      : '';

    const response = await axios.post(
      apiUrl,
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful AI assistant that helps users explore and learn about the Aurora Borealis.' +
              locationPrompt,
          },
          ...messages,
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error?.response?.data || error.message);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

export default router;

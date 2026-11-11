# Gym Chatbot Backend (Node.js + Express + Gemini)

## Setup
1. npm install express cors helmet express-rate-limit dotenv zod @google/genai
2. Copy .env.example to .env and set GEMINI_API_KEY (get one at https://aistudio.google.com/apikey)
3. npm run dev

## API
POST /api/chat

Simple:    { "message": "Is 3 sets of squats enough for legs?" }
With chat history: { "messages": [ { "role": "user", "content": "..." }, { "role": "assistant", "content": "..." }, { "role": "user", "content": "..." } ] }

Response:  { "reply": "..." }

GET /health  ->  { "status": "ok" }

## Frontend (axios), replace src/lib/mock-bot.ts
import axios from "axios";

export async function getBotReply(prompt: string): Promise<string> {
  const { data } = await axios.post<{ reply: string }>(
    `${import.meta.env.VITE_API_URL ?? "http://localhost:5000"}/api/chat`,
    { message: prompt }
  );
  return data.reply;
}

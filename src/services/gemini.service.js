import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";
import { GYM_RECEPTIONIST_PROMPT } from "../prompts/gym-coach.js";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });


export async function generateGymReply(messages) {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const startTime = performance.now();

  const response = await ai.models.generateContent({
    model: env.GEMINI_MODEL,
    contents,
    config: {
      systemInstruction: GYM_RECEPTIONIST_PROMPT,
      temperature: 0.6,
      maxOutputTokens: 500,
    },
  });

  const endTime = performance.now();

  console.log(
    `Gemini API Response Time: ${((endTime - startTime) / 1000).toFixed(2)} seconds`
  );

  return response.text?.trim() ||
    "Sorry, I couldn't come up with an answer. Please try again.";
}
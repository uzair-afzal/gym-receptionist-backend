import { z } from "zod";
import { generateGymReply } from "../services/gemini.service.js";

const text = z.string().trim().min(1).max(2000);

const bodySchema = z
  .object({
    message: text.optional(),
    messages: z
      .array(z.object({ role: z.enum(["user", "assistant"]), content: text }))
      .min(1)
      .max(30)
      .optional(),
  })
  .refine((b) => b.message || b.messages, {
    message: "Provide either 'message' or 'messages'",
  });

export async function chat(req, res) {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid request",
      details: parsed.error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    });
  }

  const messages = parsed.data.messages ?? [{ role: "user", content: parsed.data.message }];

  if (messages.at(-1).role !== "user") {
    return res.status(400).json({ error: "The last message must be from the user" });
  }

  const reply = await generateGymReply(messages);
  res.json({ reply });
}

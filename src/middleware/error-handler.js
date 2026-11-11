export function notFound(_req, res) {
  res.status(404).json({ error: "Not found" });
}

export function errorHandler(err, _req, res, _next) {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  console.error(err);

  if (err.status === 429) {
    return res.status(429).json({ error: "The AI is busy right now. Please try again shortly." });
  }
  if (err.status >= 400 && err.status < 600) {
    return res.status(502).json({ error: "The AI service failed. Please try again." });
  }

  res.status(500).json({ error: "Something went wrong" });
}

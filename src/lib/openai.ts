export async function identifyPill(imageUrl: string) {
  const apiKey = process.env.OPENAI_API_KEY!;
  const prompt =
    "Identify the pill in the image. Provide likely names, uses, and a confidence (0-1). Add verification steps, do not give medical advice.";
  const body = {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      },
    ],
  };
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) return { predictionText: "unknown", confidence: 0.0 };
  const json = await res.json();
  const text = json.choices?.[0]?.message?.content ?? "unknown";
  // naive confidence extraction; expect model to include "Confidence: x"
  const m = text.match(/confidence[:\s]+([0-1](?:\.\d+)?)/i);
  const confidence = m ? parseFloat(m[1]) : 0.5;
  return { predictionText: text, confidence };
}

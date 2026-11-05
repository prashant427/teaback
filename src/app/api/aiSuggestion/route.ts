import { NextResponse } from "next/server";

export const runtime = "edge";
export const maxDuration = 30;

const PROMPT =
  "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction.";

const FALLBACK_SUGGESTIONS = [
  "What would you do if nobody could judge you?",
  "What advice do you give others but never follow yourself?",
  "What is something you have wanted to say out loud but never have?",
];

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("AI request timed out")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

export async function POST() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ suggestions: FALLBACK_SUGGESTIONS, source: "fallback" });
  }

  try {
    const response = await withTimeout(
      fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
          "X-Title": "Bebaak",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [{ role: "user", content: PROMPT }],
          temperature: 0.7,
          max_tokens: 200,
          stream: false,
        }),
      }),
      10000
    );

    if (!response.ok) {
      throw new Error(`OpenRouter responded ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response:", data);
    const text: string = data.choices?.[0]?.message?.content ?? "";
    const suggestions = text
      .split("||")
      .map((s) => s.trim())
      .filter(Boolean);

    return NextResponse.json({
      suggestions: suggestions.length ? suggestions : FALLBACK_SUGGESTIONS,
      source: suggestions.length ? "ai" : "fallback",
    });
  } catch {
    return NextResponse.json({ suggestions: FALLBACK_SUGGESTIONS, source: "fallback" });
  }
}

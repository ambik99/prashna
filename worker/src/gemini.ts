// The one place Prashna talks to its AI model (docs/adr/0002). To change
// provider, change this module: the rest of the Worker only sees a prompt
// going in and JSON text and a cost coming out.

export const MODEL = "gemini-3.5-flash-lite";
export const MAX_OUTPUT_TOKENS = 16_384;

// US dollars per million tokens on the paid tier. Output includes thinking.
// From price lists checked on 2026-11-27; confirm against
// https://ai.google.dev/gemini-api/docs/pricing when changing MODEL.
export const PRICE_PER_MILLION = { input: 0.3, output: 2.5 };

export interface ModelAnswer {
  /** The JSON the model wrote, as text. Empty when it wrote none. */
  text: string;
  /** What this call cost, in US dollars. */
  cost: number;
  /** Why the model stopped, such as "STOP" or "MAX_TOKENS". */
  finishReason: string;
}

export type CallModel = (prompt: string, schema: object) => Promise<ModelAnswer>;

export class ModelError extends Error {}

interface GeminiResponse {
  candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] }; finishReason?: string }[];
  usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number; thoughtsTokenCount?: number };
}

export function geminiModel(apiKey: string, fetcher: typeof fetch = fetch): CallModel {
  return async (prompt, schema) => {
    const response = await fetcher(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema,
          maxOutputTokens: MAX_OUTPUT_TOKENS,
          thinkingConfig: { thinkingLevel: "low" },
        },
      }),
    });
    if (!response.ok) {
      // The body may echo the request; keep only the status in the error.
      throw new ModelError(`Gemini answered ${response.status}`);
    }
    const body = (await response.json()) as GeminiResponse;
    const candidate = body.candidates?.[0];
    const text = (candidate?.content?.parts ?? [])
      .filter((part) => !part.thought)
      .map((part) => part.text ?? "")
      .join("");
    return { text, cost: cost(body.usageMetadata), finishReason: candidate?.finishReason ?? "" };
  };
}

function cost(usage: GeminiResponse["usageMetadata"] = {}): number {
  const input = usage.promptTokenCount ?? 0;
  const output = (usage.candidatesTokenCount ?? 0) + (usage.thoughtsTokenCount ?? 0);
  return (input * PRICE_PER_MILLION.input + output * PRICE_PER_MILLION.output) / 1_000_000;
}

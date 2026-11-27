// The Gemini call itself, against a stand-in for Google's API.

import { describe, expect, it } from "vitest";
import { MAX_OUTPUT_TOKENS, MODEL, ModelError, geminiModel } from "./gemini.ts";

function fakeGoogle(status: number, body: unknown) {
  const calls: { url: string; init: RequestInit }[] = [];
  const fetcher = (async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return new Response(JSON.stringify(body), { status });
  }) as unknown as typeof fetch;
  return { calls, fetcher };
}

describe("geminiModel", () => {
  it("sends the prompt with the key in a header, structured output, low thinking and the output cap", async () => {
    const google = fakeGoogle(200, {
      candidates: [{ content: { parts: [{ text: "thinking...", thought: true }, { text: '{"a":' }, { text: "1}" }] }, finishReason: "STOP" }],
      usageMetadata: { promptTokenCount: 1_000_000, candidatesTokenCount: 600_000, thoughtsTokenCount: 400_000 },
    });
    const answer = await geminiModel("test-key", google.fetcher)("Write a paper", { type: "OBJECT" });

    expect(answer).toEqual({ text: '{"a":1}', cost: 0.3 + 2.5, finishReason: "STOP" });
    const { url, init } = google.calls[0]!;
    expect(url).toBe(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`);
    expect(url).not.toContain("test-key");
    expect((init.headers as Record<string, string>)["x-goog-api-key"]).toBe("test-key");
    const body = JSON.parse(String(init.body));
    expect(body.contents[0].parts[0].text).toBe("Write a paper");
    expect(body.generationConfig).toEqual({
      responseMimeType: "application/json",
      responseSchema: { type: "OBJECT" },
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      thinkingConfig: { thinkingLevel: "low" },
    });
  });

  it("raises a ModelError when Google answers with an error", async () => {
    const google = fakeGoogle(429, { error: { message: "quota" } });
    await expect(geminiModel("test-key", google.fetcher)("p", {})).rejects.toBeInstanceOf(ModelError);
  });
});

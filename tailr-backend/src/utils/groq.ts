/**
 * Utility for Groq OpenAI-compatible Chat Completion API.
 * Provides resilient multi-model failover when Google Gemini encounters
 * 503 high-demand errors, 429 quota exhaustion, or service timeouts.
 */

export interface GroqChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GroqCompletionOptions {
  apiKey: string;
  messages: GroqChatMessage[];
  jsonMode?: boolean;
  temperature?: number;
  models?: string[];
  maxTokens?: number;
}

export interface GroqCompletionResult {
  content: string;
  model: string;
}

// Real production Groq models (high throughput LLaMA 3.3)
export const CANDIDATE_GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
];

export async function callGroqChatCompletion(
  options: GroqCompletionOptions
): Promise<GroqCompletionResult> {
  const models =
    options.models && options.models.length > 0
      ? options.models
      : CANDIDATE_GROQ_MODELS;

  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${options.apiKey}`,
            "Content-Type": "application/json",
          },
          signal: AbortSignal.timeout(8000),
          body: JSON.stringify({
            model,
            messages: options.messages,
            temperature: options.temperature ?? 0.2,
            max_tokens: options.maxTokens,
            ...(options.jsonMode
              ? { response_format: { type: "json_object" } }
              : {}),
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(
          `Groq HTTP ${response.status} (${response.statusText}): ${errText.slice(0, 200)}`
        );
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;

      if (typeof content === "string" && content.trim()) {
        return {
          content: content.trim(),
          model,
        };
      }
    } catch (err: any) {
      lastError = err;
      console.warn(
        `[Groq] Model '${model}' call failed (${err?.message?.slice(0, 100)}). Trying next candidate model...`
      );
    }
  }

  throw lastError || new Error("[Groq] All candidate Groq models failed.");
}

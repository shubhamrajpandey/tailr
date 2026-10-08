import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env";
import { callGroqChatCompletion } from "./groq";

/**
 * AI Provider abstraction adhering to Dependency Inversion Principle (DIP).
 * Decouples domain services from concrete AI SDK clients.
 */
export interface AiCallOptions {
  model?: string;
  temperature?: number;
  systemInstruction?: string;
  responseMimeType?: string;
  timeoutMs?: number;
}

export interface AiCompletionResult {
  text: string;
  modelUsed: string;
  provider: "gemini" | "groq" | "mock";
}

export interface AiProvider {
  readonly name: string;
  isAvailable(): boolean;
  generateText(prompt: string, options?: AiCallOptions): Promise<AiCompletionResult>;
}

/**
 * Concrete Gemini AI Provider implementing the AiProvider interface.
 */
export class GeminiAiProvider implements AiProvider {
  readonly name = "gemini";
  private client: GoogleGenAI | null = null;

  constructor(apiKey?: string) {
    const key = apiKey !== undefined ? apiKey : (env.GEMINI_RESUME_API_KEY || env.GEMINI_API_KEY);
    if (key && key.trim().length > 0) {
      this.client = new GoogleGenAI({ apiKey: key });
    }
  }

  isAvailable(): boolean {
    return this.client !== null;
  }

  getClient(): GoogleGenAI | null {
    return this.client;
  }

  async generateText(prompt: string, options?: AiCallOptions): Promise<AiCompletionResult> {
    if (!this.client || !this.isAvailable()) {
      throw new Error("Gemini AI provider is not configured (missing API key)");
    }

    const model = options?.model || "gemini-2.5-flash";
    const timeoutMs = options?.timeoutMs || 8000;

    const requestConfig: any = {};
    if (options?.systemInstruction) {
      requestConfig.systemInstruction = options.systemInstruction;
    }
    if (options?.temperature !== undefined) {
      requestConfig.temperature = options.temperature;
    }
    if (options?.responseMimeType) {
      requestConfig.responseMimeType = options.responseMimeType;
    }

    const generatePromise = this.client.models.generateContent({
      model,
      contents: prompt,
      config: Object.keys(requestConfig).length > 0 ? requestConfig : undefined,
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Gemini request timed out after ${timeoutMs}ms`)),
        timeoutMs
      )
    );

    const response = await Promise.race([generatePromise, timeoutPromise]);
    const text = response.text || "";

    return {
      text,
      modelUsed: model,
      provider: "gemini",
    };
  }
}

/**
 * Concrete Groq AI Provider implementing the AiProvider interface.
 */
export class GroqAiProvider implements AiProvider {
  readonly name = "groq";
  private apiKey: string;

  constructor(apiKey?: string) {
    const key = apiKey !== undefined ? apiKey : (env.GROQ_RESUME_API_KEY || env.GROQ_API_KEY || "");
    this.apiKey = key || "";
  }

  isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async generateText(prompt: string, options?: AiCallOptions): Promise<AiCompletionResult> {
    if (!this.isAvailable()) {
      throw new Error("Groq AI provider is not configured (missing API key)");
    }

    const model = options?.model || "llama-3.3-70b-versatile";
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [];

    if (options?.systemInstruction) {
      messages.push({ role: "system", content: options.systemInstruction });
    }
    messages.push({ role: "user", content: prompt });

    const result = await callGroqChatCompletion({
      apiKey: this.apiKey,
      messages,
      models: [model],
      temperature: options?.temperature,
      jsonMode: options?.responseMimeType === "application/json",
    });

    return {
      text: result.content,
      modelUsed: result.model,
      provider: "groq",
    };
  }
}

/**
 * Factory providing instantiated default AI providers.
 */
export const defaultGeminiProvider = new GeminiAiProvider();
export const defaultGroqProvider = new GroqAiProvider();

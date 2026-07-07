import OpenAI from "openai";

const apiKey = process.env.OPENROUTER_FREE_KEY;

if (!apiKey) {
  throw new Error(
    "OPENROUTER_FREE_KEY must be set. Please provide your OpenRouter API key as a secret.",
  );
}

export const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey,
});

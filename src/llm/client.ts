import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is not set. Copy .env.example to .env and fill it in.");
}

export const anthropic = new Anthropic();

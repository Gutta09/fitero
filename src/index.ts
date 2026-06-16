import readline from "readline";
import { runAgent, type Message } from "./agent/loop.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (prompt: string) =>
  new Promise<string>((resolve) => rl.question(prompt, resolve));

async function main() {
  console.log("Fitero — AI Fitness Agent");
  console.log('Type your message and press Enter. Type "exit" to quit.\n');

  let history: Message[] = [];

  while (true) {
    const input = await ask("You: ");

    if (input.trim().toLowerCase() === "exit") {
      console.log("Goodbye!");
      rl.close();
      break;
    }

    if (!input.trim()) continue;

    try {
      const { reply, history: updated } = await runAgent(input, history);
      history = updated;
      console.log(`\nFitero: ${reply}\n`);
    } catch (err) {
      console.error("Error:", err instanceof Error ? err.message : err);
    }
  }
}

main();

import type Anthropic from "@anthropic-ai/sdk";
import { anthropic } from "../llm/client.js";
import { tools, runTool } from "../tools/index.js";
import { systemPrompt } from "./systemPrompt.js";

export type Message = Anthropic.MessageParam;

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

// Safety valve: a well-behaved conversation uses 1-3 tool rounds. The cap
// prevents a runaway loop from burning tokens if the model gets stuck.
const MAX_TOOL_ITERATIONS = 8;

export async function runAgent(
  userMessage: string,
  history: Message[] = [],
  trainingContext?: object
): Promise<{ reply: string; history: Message[] }> {
  const messages: Message[] = [
    ...history,
    { role: "user", content: userMessage },
  ];

  const toolDefs = tools.map(({ name, description, input_schema }) => ({
    name,
    description,
    input_schema: input_schema as Anthropic.Tool["input_schema"],
  }));

  const contextBlock = trainingContext
    ? `\n\n## Live Training Data (from user's app)\n\`\`\`json\n${JSON.stringify(trainingContext, null, 2)}\n\`\`\``
    : "";

  for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2048,
      system: systemPrompt + contextBlock,
      tools: toolDefs,
      messages,
    });

    messages.push({ role: "assistant", content: response.content });

    // Claude may request SEVERAL tools in one response (parallel tool use).
    // Every tool_use block must get a matching tool_result, and all results
    // must go back in a single user message — anything else is an API error.
    const toolUseBlocks = response.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
    );

    if (toolUseBlocks.length === 0) {
      const textBlock = response.content.find(
        (b): b is Anthropic.TextBlock => b.type === "text"
      );
      return { reply: textBlock?.text ?? "", history: messages };
    }

    const results = await Promise.all(
      toolUseBlocks.map(async (block) => {
        try {
          const result = await runTool(block.name, block.input);
          return { block, result, isError: false };
        } catch (err) {
          return {
            block,
            result: { error: err instanceof Error ? err.message : String(err) },
            isError: true,
          };
        }
      })
    );

    messages.push({
      role: "user",
      content: results.map(({ block, result, isError }) => ({
        type: "tool_result" as const,
        tool_use_id: block.id,
        content: JSON.stringify(result),
        ...(isError && { is_error: true }),
      })),
    });
  }

  return {
    reply:
      "I hit my tool-use limit for a single message — please try rephrasing or breaking the request into smaller steps.",
    history: messages,
  };
}

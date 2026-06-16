import type Anthropic from "@anthropic-ai/sdk";
import { anthropic } from "../llm/client.js";
import { tools, runTool } from "../tools/index.js";
import { systemPrompt } from "./systemPrompt.js";

export type Message = Anthropic.MessageParam;

const MODEL = "claude-sonnet-4-6";

export async function runAgent(
  userMessage: string,
  history: Message[] = []
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

  while (true) {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2048,
      system: systemPrompt,
      tools: toolDefs,
      messages,
    });

    messages.push({ role: "assistant", content: response.content });

    const toolUseBlock = response.content.find(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
    );

    if (!toolUseBlock) {
      const textBlock = response.content.find(
        (b): b is Anthropic.TextBlock => b.type === "text"
      );
      return { reply: textBlock?.text ?? "", history: messages };
    }

    let toolResult: unknown;
    let isError = false;

    try {
      toolResult = await runTool(toolUseBlock.name, toolUseBlock.input);
    } catch (err) {
      toolResult = { error: err instanceof Error ? err.message : String(err) };
      isError = true;
    }

    messages.push({
      role: "user",
      content: [
        {
          type: "tool_result",
          tool_use_id: toolUseBlock.id,
          content: JSON.stringify(toolResult),
          ...(isError && { is_error: true }),
        },
      ],
    });
  }
}

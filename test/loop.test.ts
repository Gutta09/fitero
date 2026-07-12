import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the LLM client and tool registry before importing the loop.
const createMock = vi.fn();
vi.mock("../src/llm/client.js", () => ({
  anthropic: { messages: { create: (...args: unknown[]) => createMock(...args) } },
}));

const runToolMock = vi.fn();
vi.mock("../src/tools/index.js", () => ({
  tools: [
    {
      name: "log_workout",
      description: "test tool",
      input_schema: { type: "object" },
      run: () => ({}),
    },
  ],
  runTool: (...args: unknown[]) => runToolMock(...args),
}));

import { runAgent } from "../src/agent/loop.js";

function textResponse(text: string) {
  return { content: [{ type: "text", text }] };
}

function toolUseResponse(blocks: Array<{ id: string; name: string; input: object }>) {
  return {
    content: blocks.map((b) => ({ type: "tool_use", ...b })),
  };
}

beforeEach(() => {
  createMock.mockReset();
  runToolMock.mockReset();
});

describe("runAgent", () => {
  it("returns the text reply when no tools are called", async () => {
    createMock.mockResolvedValueOnce(textResponse("Hello! Ready to train?"));
    const { reply, history } = await runAgent("hi");
    expect(reply).toBe("Hello! Ready to train?");
    expect(history).toHaveLength(2); // user + assistant
  });

  it("runs a tool and feeds the result back with the matching tool_use_id", async () => {
    createMock
      .mockResolvedValueOnce(toolUseResponse([{ id: "tu_1", name: "log_workout", input: {} }]))
      .mockResolvedValueOnce(textResponse("Logged it!"));
    runToolMock.mockResolvedValueOnce({ saved: true });

    const { reply } = await runAgent("log my workout");

    expect(reply).toBe("Logged it!");
    const secondCallMessages = createMock.mock.calls[1][0].messages;
    const toolResultMsg = secondCallMessages.find(
      (m: { role: string; content: unknown }) =>
        Array.isArray(m.content) && m.content[0]?.type === "tool_result"
    );
    expect(toolResultMsg.role).toBe("user");
    expect(toolResultMsg.content).toHaveLength(1);
    expect(toolResultMsg.content[0]).toMatchObject({
      type: "tool_result",
      tool_use_id: "tu_1",
    });
  });

  it("handles PARALLEL tool calls: all results in a single user message", async () => {
    createMock
      .mockResolvedValueOnce(
        toolUseResponse([
          { id: "tu_a", name: "log_workout", input: {} },
          { id: "tu_b", name: "log_workout", input: {} },
        ])
      )
      .mockResolvedValueOnce(textResponse("Both done."));
    runToolMock.mockResolvedValue({ ok: true });

    const { reply } = await runAgent("do two things");

    expect(reply).toBe("Both done.");
    const toolResultMsg = createMock.mock.calls[1][0].messages.find(
      (m: { role: string; content: unknown }) =>
        Array.isArray(m.content) && m.content[0]?.type === "tool_result"
    );
    expect(toolResultMsg.role).toBe("user");
    const ids = toolResultMsg.content.map((c: { tool_use_id: string }) => c.tool_use_id);
    expect(ids).toEqual(["tu_a", "tu_b"]); // both results, one message
  });

  it("marks failed tools with is_error instead of crashing", async () => {
    createMock
      .mockResolvedValueOnce(toolUseResponse([{ id: "tu_1", name: "log_workout", input: {} }]))
      .mockResolvedValueOnce(textResponse("Sorry, that failed."));
    runToolMock.mockRejectedValueOnce(new Error("db locked"));

    const { reply } = await runAgent("log it");

    expect(reply).toBe("Sorry, that failed.");
    const block = createMock.mock.calls[1][0].messages.find(
      (m: { role: string; content: unknown }) =>
        Array.isArray(m.content) && m.content[0]?.type === "tool_result"
    ).content[0];
    expect(block.is_error).toBe(true);
    expect(block.content).toContain("db locked");
  });

  it("stops gracefully after the max tool iterations", async () => {
    // Model keeps asking for tools forever
    createMock.mockResolvedValue(
      toolUseResponse([{ id: "tu_x", name: "log_workout", input: {} }])
    );
    runToolMock.mockResolvedValue({ ok: true });

    const { reply } = await runAgent("loop forever");

    expect(reply).toMatch(/tool-use limit/i);
    expect(createMock.mock.calls.length).toBeLessThanOrEqual(8);
  });

  it("injects live training context into the system prompt", async () => {
    createMock.mockResolvedValueOnce(textResponse("ok"));
    await runAgent("hi", [], { streak: 5 });
    expect(createMock.mock.calls[0][0].system).toContain('"streak": 5');
  });
});

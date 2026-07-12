import { describe, expect, it } from "vitest";
import { trimHistory, MAX_HISTORY_MESSAGES } from "../src/agent/history.js";
import type { Message } from "../src/agent/loop.js";

function userText(i: number): Message {
  return { role: "user", content: `message ${i}` };
}
function assistantText(i: number): Message {
  return { role: "assistant", content: `reply ${i}` };
}
function toolResult(): Message {
  return {
    role: "user",
    content: [{ type: "tool_result", tool_use_id: "tu_1", content: "{}" }],
  };
}

describe("trimHistory", () => {
  it("leaves short histories untouched", () => {
    const history = [userText(1), assistantText(1)];
    expect(trimHistory(history)).toBe(history);
  });

  it("caps long histories", () => {
    const history: Message[] = [];
    for (let i = 0; i < 60; i++) history.push(userText(i), assistantText(i));
    expect(trimHistory(history).length).toBeLessThanOrEqual(MAX_HISTORY_MESSAGES);
  });

  it("never starts the trimmed history on an orphaned tool_result", () => {
    const history: Message[] = [];
    for (let i = 0; i < 30; i++) {
      history.push(userText(i), { role: "assistant", content: [] }, toolResult(), assistantText(i));
    }
    const trimmed = trimHistory(history);
    const first = trimmed[0];
    expect(first.role).toBe("user");
    expect(typeof first.content).toBe("string");
  });
});

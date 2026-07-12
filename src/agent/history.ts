import type { Message } from "./loop.js";

// Keep the last N messages so a long-lived session doesn't grow the prompt
// (and the API bill) without bound. The cut must land on a plain-text user
// turn — a history slice that starts with orphaned tool_result blocks is an
// API error (every tool_result must follow its tool_use).
export const MAX_HISTORY_MESSAGES = 40;

export function trimHistory(history: Message[]): Message[] {
  if (history.length <= MAX_HISTORY_MESSAGES) return history;
  let start = history.length - MAX_HISTORY_MESSAGES;
  while (start < history.length) {
    const m = history[start];
    const isPlainUserText = m.role === "user" && typeof m.content === "string";
    if (isPlainUserText) break;
    start++;
  }
  return history.slice(start);
}

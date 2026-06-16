// Runs in a Web Worker — keeps ticking even when the tab is backgrounded
let interval: ReturnType<typeof setInterval> | null = null;
let elapsed = 0;

self.onmessage = (e: MessageEvent<{ type: "start" | "stop" | "reset" }>) => {
  if (e.data.type === "start") {
    if (interval) return;
    interval = setInterval(() => {
      elapsed += 1;
      self.postMessage({ elapsed });
    }, 1000);
  } else if (e.data.type === "stop") {
    if (interval) { clearInterval(interval); interval = null; }
  } else if (e.data.type === "reset") {
    if (interval) { clearInterval(interval); interval = null; }
    elapsed = 0;
    self.postMessage({ elapsed });
  }
};

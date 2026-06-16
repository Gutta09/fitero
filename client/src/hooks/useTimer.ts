import { useState, useEffect, useRef } from "react";

export function useTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const worker = new Worker(new URL("../workers/timer.worker.ts", import.meta.url), {
      type: "module",
    });
    worker.onmessage = (e: MessageEvent<{ elapsed: number }>) => {
      setElapsed(e.data.elapsed);
    };
    workerRef.current = worker;
    return () => worker.terminate();
  }, []);

  const start = () => {
    workerRef.current?.postMessage({ type: "start" });
    setRunning(true);
  };

  const stop = () => {
    workerRef.current?.postMessage({ type: "stop" });
    setRunning(false);
  };

  const reset = () => {
    workerRef.current?.postMessage({ type: "reset" });
    setElapsed(0);
    setRunning(false);
  };

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return { elapsed, running, start, stop, reset, fmt };
}

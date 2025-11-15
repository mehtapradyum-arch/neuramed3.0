type QueueItem = { url: string; method: string; body?: any; headers?: Record<string, string> };

const QUEUE_KEY = "offlineQueue";
export async function enqueue(item: QueueItem) {
  const items = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
  items.push(item);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(items));
}

export async function flush() {
  const items: QueueItem[] = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
  const remaining: QueueItem[] = [];
  for (const it of items) {
    try {
      await fetch(it.url, { method: it.method, headers: it.headers, body: it.body });
    } catch {
      remaining.push(it);
    }
  }
  localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
}

window.addEventListener("online", () => flush());

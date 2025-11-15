"use client";
import { useEffect, useState } from "react";

export default function DoseChecklist() {
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/schedule/today").then((r) => r.json()).then((d) => setLogs(d.logs));
  }, []);
  const confirm = async (id: string) => {
    setLogs((prev) => prev.map((l) => (l.id === id ? { ...l, status: "TAKEN" } : l))); // optimistic
    await fetch("/api/schedule/confirm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ doseLogId: id }) });
  };
  const skip = async (id: string) => {
    setLogs((prev) => prev.map((l) => (l.id === id ? { ...l, status: "SKIPPED" } : l)));
    await fetch("/api/schedule/skip", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ doseLogId: id }) });
  };
  return (
    <div className="space-y-3">
      {logs.map((l) => (
        <div key={l.id} className="p-4 bg-white rounded-2xl shadow flex items-center justify-between">
          <div>
            <p className="font-medium">{l.med.name}</p>
            <p className="text-sm text-textSecondary">Scheduled: {new Date(l.scheduledAt).toLocaleTimeString()}</p>
          </div>
          <div className="flex gap-2">
            <button disabled={l.status !== "PENDING"} onClick={() => confirm(l.id)} className="px-3 py-2 rounded-full bg-black text-white">Taken</button>
            <button disabled={l.status !== "PENDING"} onClick={() => skip(l.id)} className="px-3 py-2 rounded-full bg-gray-200">Skip</button>
          </div>
        </div>
      ))}
    </div>
  );
}

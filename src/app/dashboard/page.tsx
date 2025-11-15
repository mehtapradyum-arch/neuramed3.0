"use client";
import DoseChecklist from "@/components/DoseChecklist";

export default function Dashboard() {
  return (
    <main className="p-4">
      <h2 className="text-2xl mb-4">Today</h2>
      <DoseChecklist />
    </main>
  );
}

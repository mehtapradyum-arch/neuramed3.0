"use client";
import { useEffect, useState } from "react";

export default function CaregiverDashboard() {
  const [patients, setPatients] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/caregiver/patients").then((r) => r.json()).then((d) => setPatients(d.patients));
  }, []);
  return (
    <main className="p-4">
      <h2 className="text-2xl mb-4">Caregiver</h2>
      <div className="space-y-3">
        {patients.map((p) => (
          <div key={p.id} className="p-4 bg-white rounded-2xl shadow">
            <p className="font-medium">{p.name ?? p.email}</p>
            <a className="text-sm text-blue-600" href={`/caregiver/patient/${p.id}`}>Feed</a>
          </div>
        ))}
      </div>
    </main>
  );
}

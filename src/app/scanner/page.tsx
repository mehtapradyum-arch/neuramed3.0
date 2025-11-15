"use client";
import { useState } from "react";
import CameraCapture from "@/components/CameraCapture";

export default function ScannerPage() {
  const [result, setResult] = useState<any>(null);
  const upload = async (blob: Blob) => {
    const fd = new FormData();
    fd.append("file", blob, `pill-${Date.now()}.jpg`);
    const res = await fetch("/api/vision/identify", { method: "POST", body: fd });
    const json = await res.json();
    setResult(json.scan);
  };
  return (
    <main className="p-4">
      <h2 className="text-2xl">Pill Scanner</h2>
      <CameraCapture onCaptured={upload} />
      {result && (
        <div className="mt-4 p-4 bg-white rounded-2xl shadow">
          <p className="font-medium">Prediction</p>
          <p className="text-sm text-textSecondary">{result.predictionText}</p>
          <p className="text-sm">Confidence: {result.confidence.toFixed(2)}</p>
        </div>
      )}
    </main>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";

export default function CameraCapture({ onCaptured }: { onCaptured: (blob: Blob) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch {
        // fallback: file input
      }
    })();
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, []);
  const capture = () => {
    const canvas = document.createElement("canvas");
    const v = videoRef.current!;
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(v, 0, 0);
    canvas.toBlob((b) => b && onCaptured(b!), "image/jpeg", 0.8);
  };
  return (
    <div className="flex flex-col items-center">
      <video ref={videoRef} autoPlay playsInline className="rounded-xl w-full max-w-sm" />
      <button onClick={capture} className="mt-3 px-4 py-2 bg-black text-white rounded-full">Capture</button>
      <label className="mt-2 text-sm text-textSecondary">or upload</label>
      <input type="file" accept="image/*" onChange={(e) => e.target.files && onCaptured(e.target.files[0])} />
    </div>
  );
}

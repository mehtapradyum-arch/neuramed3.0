"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
  useEffect(() => {
    gsap.from(".hero", { opacity: 0, y: 40, duration: 1 });
    gsap.to(".parallax", { yPercent: -20, scrollTrigger: { scrub: true } });
  }, []);
  return (
    <main className="min-h-screen">
      <section className="hero h-[70vh] flex flex-col justify-center items-center bg-gradient-to-b from-white to-surface">
        <h1 className="text-4xl font-semibold">NeuraMed</h1>
        <p className="text-textSecondary mt-2">Watchful Guardian for Meds</p>
        <a href="/signup" className="mt-6 px-6 py-3 rounded-full bg-black text-white">Get started</a>
      </section>
      <section className="parallax p-6">
        <div className="grid gap-4">
          <div className="p-6 bg-white rounded-2xl shadow-md">AI pill recognition</div>
          <div className="p-6 bg-white rounded-2xl shadow-md">Caregiver alerts</div>
          <div className="p-6 bg-white rounded-2xl shadow-md">Offline-first PWA</div>
        </div>
      </section>
    </main>
  );
}

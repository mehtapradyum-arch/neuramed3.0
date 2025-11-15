import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neuramed",
  description: "Medication management for patients and caregivers"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

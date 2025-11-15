import "./globals.css";
import "@/styles/tokens.css";
import { MotionConfig } from "framer-motion";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-surface text-textPrimary">
        <MotionConfig transition={{ type: "spring", stiffness: 300, damping: 30 }}>
          {children}
        </MotionConfig>
      </body>
    </html>
  );
}

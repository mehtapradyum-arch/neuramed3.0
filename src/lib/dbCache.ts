// src/lib/dbCache.ts
import { prisma } from "@/lib/prisma";

/**
 * Daily cleanup of stale data.
 */
export async function cleanupDatabase(): Promise<void> {
  // Example: delete old verification tokens
  await prisma.verificationToken.deleteMany({
    where: {
      expires: { lt: new Date() }
    }
  });

  // Example: delete sessions older than 30 days
  await prisma.session.deleteMany({
    where: {
      expires: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }
  });

  console.log("Database cleanup complete");
}

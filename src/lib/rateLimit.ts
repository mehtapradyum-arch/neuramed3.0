import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = await rateLimit(`meds:${session.user?.email}`, 100, 60);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded", resetAt: limit.resetAt },
      { status: 429 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user!.email! }
  });
  const meds = await prisma.medication.findMany({
    where: { userId: user!.id }
  });

  return NextResponse.json({ meds });
}

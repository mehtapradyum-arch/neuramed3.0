
import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/storage";
import { identifyPill } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await rateLimit(`vision:${session.user?.email}`);

  const data = await req.formData();
  const file = data.get("file");
  if (!(file && typeof file === "object" && "arrayBuffer" in file)) {
    return NextResponse.json({ error: "No image" }, { status: 400 });
  }
  const buf = Buffer.from(await (file as File).arrayBuffer());
  const contentType = (file as File).type;
  const filename = `scans/${Date.now()}-${(file as File).name}`;
  const { url } = await uploadImage(buf, filename, contentType);

  const { predictionText, confidence } = await identifyPill(url);

  const scan = await prisma.visionScan.create({
    data: { userId: (session.user as any).id, imageUrl: url, predictionText, confidence },
  });

  return NextResponse.json({ scan });
}

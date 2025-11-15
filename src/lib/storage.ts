type UploadResult = { url: string };

export async function uploadImage(file: Buffer, filename: string, contentType: string): Promise<UploadResult> {
  const provider = process.env.STORAGE_PROVIDER || "blob";
  if (provider === "s3") {
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
    const client = new S3Client({
      region: process.env.S3_REGION!,
      endpoint: process.env.S3_ENDPOINT,
      credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID!, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY! },
      forcePathStyle: !!process.env.S3_ENDPOINT,
    });
    const bucket = process.env.S3_BUCKET!;
    await client.send(new PutObjectCommand({ Bucket: bucket, Key: filename, Body: file, ContentType: contentType }));
    const url = `${process.env.S3_ENDPOINT || `https://${bucket}.s3.${process.env.S3_REGION}.amazonaws.com`}/${bucket}/${filename}`;
    return { url };
  } else {
    const token = process.env.VERCEL_BLOB_READ_WRITE_TOKEN!;
    const res = await fetch(`https://api.vercel.com/v2/blobs`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": contentType },
      body: file,
    });
    const json = await res.json();
    return { url: json.url };
  }
}

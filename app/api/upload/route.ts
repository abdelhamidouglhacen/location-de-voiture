import { createHash } from "crypto";
import { NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const webp = await sharp(Buffer.from(await file.arrayBuffer()))
    .rotate()
    .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  const timestamp = String(Math.round(Date.now() / 1000));
  const transformation = "f_webp,q_auto:good";
  const signature = createHash("sha1")
    .update(
      `timestamp=${timestamp}&transformation=${transformation}${process.env.CLOUDINARY_API_SECRET}`,
    )
    .digest("hex");

  const body = new FormData();
  body.append("file", `data:image/webp;base64,${webp.toString("base64")}`);
  body.append("timestamp", timestamp);
  body.append("transformation", transformation);
  body.append("api_key", process.env.CLOUDINARY_API_KEY!);
  body.append("signature", signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body },
  );
  const data = await res.json();
  console.log("CLOUDINARY", data.format, data.secure_url, data.error);

  if (!res.ok || data.format !== "webp") {
    return NextResponse.json(
      { error: data?.error?.message ?? `stored as ${data.format}`, data },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: data.secure_url });
}
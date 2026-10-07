import { createHash } from "crypto";
import { NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 },
      );
    }

    // 1. Read original image
    const input = Buffer.from(await file.arrayBuffer());

    // 2. Convert image -> WebP
    const webp = await sharp(input)
      .rotate()
      .resize({
        width: 2000,
        height: 2000,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality: 85,
      })
      .toBuffer();

    // Check what Sharp actually produced
    const metadata = await sharp(webp).metadata();

    console.log("SHARP:", {
      original: file.name,
      originalType: file.type,
      outputFormat: metadata.format,
      outputSize: webp.length,
    });

    if (metadata.format !== "webp") {
      throw new Error("Sharp failed to create WebP");
    }

    // 3. Create Cloudinary signature
    const timestamp = Math.floor(Date.now() / 1000).toString();

    const signatureString =
      `timestamp=${timestamp}` +
      process.env.CLOUDINARY_API_SECRET!;

    const signature = createHash("sha1")
      .update(signatureString)
      .digest("hex");

    // 4. Upload the ACTUAL WebP binary
    const body = new FormData();

    body.append(
      "file",
      new Blob([webp], {
        type: "image/webp",
      }),
      "image.webp",
    );

    body.append("timestamp", timestamp);
    body.append("api_key", process.env.CLOUDINARY_API_KEY!);
    body.append("signature", signature);

    // 5. Upload to Cloudinary
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body,
      },
    );

    const data = await res.json();

    console.log("CLOUDINARY:", {
      format: data.format,
      url: data.secure_url,
      public_id: data.public_id,
      error: data.error,
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          error: data?.error?.message ?? "Cloudinary upload failed",
        },
        { status: 500 },
      );
    }

    if (data.format !== "webp") {
      return NextResponse.json(
        {
          error: `Expected WebP but Cloudinary returned ${data.format}`,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      url: data.secure_url,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : "Image upload failed",
      },
      { status: 500 },
    );
  }
}
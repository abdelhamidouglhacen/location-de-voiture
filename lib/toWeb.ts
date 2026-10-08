async function toWebp(
  file: File,
  quality = 0.8,
  maxSize = 1920,
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("WebP conversion failed"))),
      "image/webp",
      quality,
    ),
  );
}

export async function uploadImage(file: File): Promise<string> {
  // take the file from the input
  let body: Blob = file;
  // take only name of the file
  let name = file.name;

  try {
    // try to convert the picture to WebP in the browser
    body = await toWebp(file);
    // change file name
    name = file.name.replace(/\.[^.]+$/, "") + ".webp";
  } catch {
    // fallback: upload the original, Cloudinary will still serve WebP (Step 4)
  }

  // send pic into cloudinary using FormData()
  const fd = new FormData();
  // send file with its name
  fd.append("file", body, name);
  // address the upload preset where pics will uploaded
  fd.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

  // send the picture to Cloudinary
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: fd },
  );
  const data = await res.json();
  // stop with an error if Cloudinary refused the file
  if (!res.ok) throw new Error(data.error?.message ?? "Upload failed");
  // return the final image link (saved later in Supabase)
  return data.secure_url as string;
}

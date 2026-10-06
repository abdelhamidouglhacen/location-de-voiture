export async function toWebp(file: File): Promise<File> {
  const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
  if (file.type === "image/webp" || /\.webp$/i.test(file.name)) return file;

  try {
    const bitmap = await loadBitmap(file);
    const MAX = 2000;
    const scale = Math.min(1, MAX / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));

    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.85)
    );

    // Chrome sets image/webp. Firefox often leaves type empty. Size is the real check.
    if (!blob || blob.size < 100) {
      console.warn("toBlob failed", file.name, blob?.type, blob?.size);
      return file;
    }

    return new File([blob], name, { type: "image/webp", lastModified: Date.now() });
  } catch (err) {
    console.error("toWebp error:", file.name, file.type, err);
    return file;
  }
}

async function loadBitmap(file: File): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error("decode failed"));
        el.src = url;
      });
      return await createImageBitmap(img);
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}
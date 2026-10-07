export async function toWebp(file: File): Promise<File> {
  if (file.type === "image/webp") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const MAX = 2000;
    const scale = Math.min(1, MAX / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas
      .getContext("2d")!
      .drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.85),
    );

    if (!blob || blob.type !== "image/webp") {
      console.warn("toBlob failed or not webp:", blob?.type);
      return file;
    }

    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", {
      type: "image/webp",
    });
  } catch (err) {
    console.error("toWebp error:", file.name, err);
    throw err;
  }
}

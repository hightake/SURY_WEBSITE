import { backend } from "../data";
import type { Img } from "../models/content";

/** Resize an uploaded photo in the browser: WebP, up to 1600px plus a 700px version. */
export async function prepareImage(file: File) {
  const bitmap = await createImageBitmap(file);
  const encode = async (max: number) => {
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, w, h);
    const blob = await new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("encode"))), "image/webp", 0.82));
    return { blob, w, h };
  };
  const full = await encode(1600);
  const small = await encode(700);
  return { full: full.blob, small: small.blob, w: full.w, h: full.h };
}

/** Resize and store an image; returns it ready to put in the content. */
export async function uploadImage(file: File, alt = ""): Promise<Img> {
  return backend.uploadImage(await prepareImage(file), alt);
}

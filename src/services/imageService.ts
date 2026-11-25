import { backend } from "../data";
import type { Img } from "../models/content";

/** The largest photo the admin accepts before resizing (a phone photo is usually 3–12 MB). */
export const MAX_UPLOAD_MB = 25;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
export const ACCEPT_ATTR = ACCEPTED.join(",");

/** Why an upload failed, in words the site owner can act on. */
export class UploadError extends Error {}

const mb = (bytes: number) => (bytes / 1024 / 1024).toFixed(1).replace(/\.0$/, "");

function checkFile(file: File) {
  const name = file.name.toLowerCase();
  if (/\.(heic|heif)$/.test(name) || /hei[cf]/.test(file.type))
    throw new UploadError("פורמט HEIC (של אייפון) אינו נתמך. אפשר לשמור את התמונה כ-JPG, או להגדיר באייפון שהמצלמה תשמור בפורמט JPG (הגדרות > מצלמה > תבניות).");
  if (!file.type.startsWith("image/"))
    throw new UploadError("הקובץ אינו תמונה. אפשר להעלות JPG, PNG או WebP.");
  if (!ACCEPTED.includes(file.type))
    throw new UploadError(`פורמט ${file.type.replace("image/", "").toUpperCase()} אינו נתמך. אפשר להעלות JPG, PNG או WebP.`);
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024)
    throw new UploadError(`הקובץ כבד מדי (${mb(file.size)}MB). אפשר להעלות עד ${MAX_UPLOAD_MB}MB.`);
}

/** Resize an uploaded photo in the browser: WebP, up to 1600px plus a 700px version. */
export async function prepareImage(file: File) {
  checkFile(file);
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new UploadError("הקובץ פגום או שלא ניתן לקרוא אותו. כדאי לפתוח אותו במחשב, לשמור מחדש כ-JPG ולנסות שוב.");
  }
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
  const prepared = await prepareImage(file);
  try {
    return await backend.uploadImage(prepared, alt);
  } catch {
    throw new UploadError("השמירה בשרת נכשלה. כדאי לבדוק את החיבור לאינטרנט ולנסות שוב.");
  }
}

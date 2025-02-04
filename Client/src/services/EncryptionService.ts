import { Buffer } from "buffer";
import crypto from "crypto";

const algorithm = "aes-256-cbc";
const key = process.env.VITE_ENCRYPTION_KEY;
if (!key) throw new Error("VITE_ENCRYPTION_KEY is not defined");

const iv_length = 16;

export const encryptData = (data: string): string => {
  const iv = crypto.randomBytes(iv_length);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);

  let encrypted = cipher.update(data, "utf8", "base64");
  encrypted += cipher.final("base64");

  return `${iv.toString("base64")}:${encrypted}`;
};

export const decryptData = (data: string): string => {
  const [ivString, encryptedData] = data.split(":");
  const iv = Buffer.from(ivString, "base64");
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);

  let decrypted = decipher.update(encryptedData, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

import { randomUUID, randomBytes } from "crypto";
import bcryptjs from "bcryptjs"

export const genId = () => randomUUID();

export const genHash = (salt: number | string = 10, text: string) => {
  // const newSalt = salt.toString()
  return bcryptjs.hashSync(text, salt);
};

export const compareHash = (text: string, hash: string) => {
  return bcryptjs.compareSync(text, hash);
};

export const genUnique = () => {
  try {
      return randomBytes(5).toString("hex");
  } catch (error) {
      console.error("Error generating salt");
      throw error;
  }
}

export const isUndefined = (prop: any) => typeof prop === "undefined"

export const checkDataExists= <T>(data: T[], element: T ) => {
  if(data.length === 0) return false;
  if(data.length > 0) return data.includes(element)
}

export const isEmpty = (prop: any) => {
  if(typeof prop === "undefined") return true;
  if(prop === "" || prop === null) return true;
  return false
}
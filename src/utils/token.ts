import { JWT_SECRET } from "../config";
import jwt from "jsonwebtoken"
import { JWTInterface } from "../types/interface";


export function genAccessToken<JWT extends JWTInterface>(payload: JWT) {
  if (payload === undefined) {
    return console.error("Access token requires a payload field but got none");
  }

  return jwt.sign(payload, JWT_SECRET!, { expiresIn: "1yr" });
}

export function genRefreshToken<JWT extends JWTInterface>(payload: JWT) {
  if (payload === undefined) {
    return console.error("Refresh token requires a payload field but got none");
  }
  return jwt.sign(payload, JWT_SECRET!, { expiresIn: "1yr" });
}

import { decodeJwt, jwtVerify } from "jose";

export const verifyTokenSignature = async (token: string): Promise<boolean> => {
  const SECRET_KEY = process.env.SECRET_KEY;
  try {
    await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    console.log("Token signature verified");
    return true;
  } catch (error) {
    console.log("Cannot verify token signature:", error);
    return false;
  }
};

export const validateToken = async (token: string): Promise<boolean> => {
  try {
    const decoded = decodeJwt(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp !== undefined && currentTime >= decoded.exp;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};

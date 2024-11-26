import { decodeJwt } from "jose";

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

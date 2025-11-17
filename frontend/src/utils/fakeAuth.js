// utils/fakeAuth.js
import sampleUserCart from "../data/sampleUserCart"; // adjust path if needed
import { Base64 } from "js-base64";

export const generateFakeToken = (userId = 1) => {
  const tokenPayload = {
    id: userId,
    name: "John Döe", // Unicode-safe
    email: "johndoe@example.com",
    role: "user",
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24h expiry
    cart: sampleUserCart,
    wishlist: [1, 5, 7],
  };

  // Encode with Base64 library (Unicode-safe)
  const base64Payload = Base64.encode(JSON.stringify(tokenPayload));

  const fakeToken = `fakeHeader.${base64Payload}.fakeSignature`;
  return fakeToken;
};

export const getFakeUser = () => {
  const token = localStorage.getItem("fakeToken");
  if (!token) return null;

  try {
    // Decode with Base64 library
    const payload = JSON.parse(Base64.decode(token.split(".")[1]));
    return payload;
  } catch (error) {
    console.error("Invalid fake token", error);
    return null;
  }
};

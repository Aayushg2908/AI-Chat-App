import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, useSession, signOut } = createAuthClient({
  baseURL: "http://localhost:3000",
  // baseURL: "https://all-in-one-nine-lemon.vercel.app",
});

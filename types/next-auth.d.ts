import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string; // Add role to DefaultSession.User
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string; // Add role to User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string; // Add role to JWT
  }
}

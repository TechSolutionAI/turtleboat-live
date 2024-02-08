import NextAuth from "next-auth";
import { UserBasicProfile, UserAdvancedProfile } from "@/types/user.type";

declare module "next-auth" {
  interface User {
    id?: string | null | undefined;
    _id?: string | null | undefined;
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
    role?: string | null | undefined;
    isNewUser?: boolean | null | undefined;
    basicProfile?: UserBasicProfile | null | undefined;
    advancedProfile?: UserAdvancedProfile | null | undefined;
    tokens: number | 0;
    totalEarnedTokens: number | 0;
    createdAt: string;
    lastLogin?: string | undefined;
    followers?: any;
  }
}

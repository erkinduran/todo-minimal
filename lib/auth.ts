import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {UserType} from "../types/UserType";

export async function getSession(): Promise<{ user?: UserType|null } | null> {
    return getServerSession(authOptions);
}
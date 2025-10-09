import {UserType} from "./UserType";
import {DefaultSession} from "next-auth";

export interface SessionType extends DefaultSession {
    user: UserType;
    expires: string;
}
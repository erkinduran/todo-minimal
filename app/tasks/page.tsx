import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import TasksClient from "./tasks-client";


export default async function TasksPage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <a
                    href="/api/auth/signin"
                    className="px-4 py-2 rounded-xl bg-black text-white"
                >Sign in with Google</a>
            </div>
        );
    }
    return <TasksClient />;
}
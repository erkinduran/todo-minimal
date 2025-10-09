import {NextResponse, NextRequest} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {prisma} from "@/lib/prisma";
import {UserType} from "@/types/UserType";

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string; }>; }
) {
    const {id} = await context.params;

    const session = await getServerSession(authOptions);
    const userId = (session?.user as UserType)?.id;
    if (!userId) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const found = await prisma.task.findFirst({where: {id, userId}});
    if (!found) return NextResponse.json({error: "Not Found"}, {status: 404});

    const updated = await prisma.task.update({
        where: {id: found.id},
        data: {done: !found.done},
    });

    return NextResponse.json(updated);
}
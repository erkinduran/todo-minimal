import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {getSession} from "@/lib/auth";

interface Params {
    params: { id: string }
}

export async function PATCH(_req: Request, {params}: Params) {
    const session = await getSession();
    if (!session?.user?.id) return NextResponse.json({error: "Unauthorized"}, {status: 401});


    const found = await prisma.task.findFirst({where: {id: params.id, userId: session.user.id}});
    if (!found) return NextResponse.json({error: "Not Found"}, {status: 404});


    const updated = await prisma.task.update({
        where: {id: found.id},
        data: {done: !found.done},
    });
    return NextResponse.json(updated);
}
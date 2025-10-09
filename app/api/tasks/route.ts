// app/api/tasks/route.ts
import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {CreateTaskSchema, ListQuerySchema} from "@/lib/validation";
import {UserType} from "@/types/UserType";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as UserType)?.id;

    const resolvedUserId =
        userId ??
        (session?.user?.email
            ? (await prisma.user.findUnique({where: {email: session.user.email}}))?.id
            : null);

    if (!resolvedUserId) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const url = new URL(req.url);
    const parsed = ListQuerySchema.safeParse({
        q: url.searchParams.get("q") ?? undefined,
        page: url.searchParams.get("page") ?? undefined,
        pageSize: url.searchParams.get("pageSize") ?? undefined,
    });
    if (!parsed.success) return NextResponse.json({error: "Bad Request"}, {status: 400});

    const {q, page, pageSize} = parsed.data;
    const where = {
        userId: resolvedUserId,
        ...(q ? {title: {contains: q, mode: "insensitive" as const}} : {}),
    };

    const [total, items] = await Promise.all([
        prisma.task.count({where}),
        prisma.task.findMany({
            where,
            orderBy: {createdAt: "desc"},
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    return NextResponse.json({items, page, pageSize, total, totalPages});
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const userId =
        (session?.user as UserType)?.id ??
        (session?.user?.email
            ? (await prisma.user.findUnique({where: {email: session.user.email}}))?.id
            : null);

    if (!userId) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const body = await req.json().catch(() => null);
    const parsed = CreateTaskSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({error: "Bad Request"}, {status: 400});

    const task = await prisma.task.create({data: {title: parsed.data.title, userId}});
    return NextResponse.json(task, {status: 201});
}
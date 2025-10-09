import {z} from "zod";

export const CreateTaskSchema = z.object({
    title: z.string().trim().min(1).max(200),
});

export const ListQuerySchema = z.object({
    q: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(10),
});
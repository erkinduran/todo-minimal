"use client";
import {useEffect, useState} from "react";

type Task = { id: string; title: string; done: boolean; createdAt: string };
type Page = { items: Task[]; page: number; pageSize: number; total: number; totalPages: number };


export default function TasksClient() {
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [data, setData] = useState<Page | null>(null);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);

    async function load() {
        setLoading(true);
        const res = await fetch(`/api/tasks?q=${encodeURIComponent(q)}&page=${page}&pageSize=${pageSize}`, {cache: "no-store"});
        if (res.ok) setData(await res.json());
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, [q, page]);

    async function createTask(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch("/api/tasks", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title})
        });
        if (res.status === 201) {
            setTitle("");
            setPage(1);
            await load();
        }
    }

    async function toggle(id: string) {
        const res = await fetch(`/api/tasks/${id}/toggle`, {method: "PATCH"});
        if (res.ok) await load();
    }

    return (
        <div className="mx-auto max-w-2xl p-6">
            <h1 className="text-2xl font-semibold mb-4">My Tasks</h1>

            <form
                onSubmit={createTask}
                className="flex gap-2 mb-4"
            >
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="New task title"
                    className="flex-1 rounded-xl border p-2"
                    maxLength={200}
                />
                <button
                    className="rounded-xl px-4 py-2 bg-blue-600 text-white"
                    disabled={!title.trim()}
                >Add
                </button>
            </form>

            <input
                value={q}
                onChange={(e) => {
                    setPage(1);
                    setQ(e.target.value);
                }}
                placeholder="Search..."
                className="w-full rounded-xl border p-2 mb-3"
            />

            {loading && <div>Loading…</div>}
            {data && (
                <div className="space-y-2">
                    {data.items.map((t) => (
                        <div
                            key={t.id}
                            className="flex items-center justify-between rounded-xl border bg-white p-3"
                        >
                            <button
                                onClick={() => toggle(t.id)}
                                className={`h-5 w-5 rounded border mr-3 ${t.done ? "bg-green-500" : "bg-white"}`}
                                aria-label="toggle"
                            />
                            <span className={`flex-1 ${t.done ? "line-through text-gray-400" : ""}`}>{t.title}</span>
                            <time className="text-xs text-gray-400">{new Date(t.createdAt).toLocaleString()}</time>
                        </div>
                    ))}

                    <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-gray-500">Page {data.page} / {data.totalPages} • {data.total} items</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className="rounded-xl border px-3 py-1"
                                disabled={data.page <= 1}
                            >Prev
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                                className="rounded-xl border px-3 py-1"
                                disabled={data.page >= data.totalPages}
                            >Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
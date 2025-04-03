"use server";
import { prisma } from "@/lib/prisma";

export async function createUpworkRequestLog(url: string) {
    try {
        const lastRow = await prisma.upworkRequestsLog.findFirst({ orderBy: { createdDate: "desc" } });
        const duration = lastRow ? new Date().getTime() - new Date(lastRow.createdDate).getTime() : 1;

        if (duration > 1000) return;

        await prisma.upworkRequestsLog.create({ data: { url, duration } });
    } catch (error: any) {
        console.error("Error save/update room:", error);
    }
}

"use server";
import { prisma } from "@/lib/prisma";

export async function getOurUpworkUsers() {
    try {
        return await prisma.upworkUser.findMany({
            where: {
                organization: {
                    isOur: true
                }
            }
        });
    } catch (error) {
        console.error("Get all upwork users error", error);
        return [];
    }
}

export async function saveOurAgent(context: any, orgId: string) {
    console.log('saveOurAgent...');
    try {
        const { freelancerId, freelancerName } = context;
        console.log("==== freelancerId, freelancerName ==> ", freelancerId, freelancerName);
        const existingUser = await prisma.upworkUser.findUnique({ where: { id: freelancerId } });
        if (!existingUser) {
            await prisma.upworkUser.create({ data: { id: freelancerId, name: freelancerName, organization: { connect: { id: orgId } } } });
        }
    } catch (error) {
        console.error("Save user error: ", error);
    }
}
